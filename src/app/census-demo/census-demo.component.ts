import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as L from 'leaflet';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  safeHtml?: SafeHtml;
}

interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

const RESPONSES: Record<string, { text: string; table?: TableData }> = {
  default: {
    text: '<p>Based on the Census boundary data and geospatial RAG retrieval:</p><p><strong>Key findings:</strong></p><ul><li>Population: 4,231 residents</li><li>Median household income: $72,450</li><li>Poverty rate: 8.2%</li><li>Median age: 34.2 years</li><li>Housing units: 1,892 (87% occupied)</li></ul><p>This tract shows above-average income and lower poverty compared to the surrounding MSA.</p>'
  },
  income: {
    text: '<p>Retrieved from Census ACS 5-Year estimates via geospatial RAG:</p>',
    table: { headers: ['Tract', 'Median Income', 'Per Capita', 'Poverty %'], rows: [['5301.01', '$78,432', '$42,150', '6.8%'], ['5301.02', '$65,210', '$35,890', '9.1%'], ['5302.01', '$82,100', '$48,200', '5.2%']] }
  },
  density: {
    text: '<p>Population density comparison from Census boundary layers:</p>',
    table: { headers: ['County', 'Pop. Density/sq mi', 'Total Pop.', 'Land Area'], rows: [['Denver County', '4,674', '715,522', '153.0 sq mi'], ['Boulder County', '442', '330,758', '740.0 sq mi']] }
  },
  poverty: {
    text: '<p>Urban tract poverty analysis (Chicago MSA):</p>',
    table: { headers: ['Tract', 'Poverty Rate', 'Median Income', 'Unemployment'], rows: [['17031010100', '12.4%', '$52,100', '5.2%'], ['17031010200', '18.7%', '$38,400', '8.1%'], ['17031010300', '9.2%', '$61,200', '4.1%']] }
  },
  austin: {
    text: '<p>Demographic profile for Austin urban planning (Travis County):</p>',
    table: { headers: ['Indicator', 'Value', 'vs. State Avg'], rows: [['Population', '1,028,220', '+24%'], ['Median HH Income', '$78,965', '+18%'], ["Population 25+ w/ Bachelor's", '52.3%', '+22%'], ['Median Age', '33.4', '-3 years']] }
  }
};

const SUGGESTED_QUERIES = [
  { label: 'Median income - Seattle tract', query: 'What is the median household income for census tract 5301 in Seattle?' },
  { label: 'Population density comparison', query: 'Compare population density between Denver and Boulder counties' },
  { label: 'Poverty rates - Chicago', query: 'Show me poverty rates for urban census tracts in Chicago' },
  { label: 'Austin demographics', query: 'Demographic breakdown for urban planning in Austin TX' }
];

const REGION_DATA: Record<string, { popCount: string; density: string; population: string; income: string }> = {
  Seattle: { popCount: '4,231', density: '10.2/sq mi', population: '715,522', income: '$78,432' },
  Denver: { popCount: '715,522', density: '4,674/sq mi', population: '715,522', income: '$68,400' },
  Chicago: { popCount: '12,450', density: '18.2/sq mi', population: '2,700,000', income: '$52,100' },
  Austin: { popCount: '1,028,220', density: '1,389/sq mi', population: '1,028,220', income: '$78,965' },
  Phoenix: { popCount: '1,608,139', density: '2,798/sq mi', population: '1,608,139', income: '$62,050' }
};

const BOUNDARY_DATA: Record<string, { popCount: string; density: string }> = {
  'Census tract': { popCount: '4,231', density: '10.2/sq mi' },
  'County': { popCount: '715,522', density: '4,674/sq mi' },
  'ZIP code': { popCount: '32,450', density: '2,100/sq mi' },
  'Block group': { popCount: '1,240', density: '42.1/sq mi' }
};

const VARIANT_DATA: Record<string, { population: string; income: string }> = {
  'Standard': { population: '715,522', income: '$68,400' },
  'Summary': { population: '712,000', income: '$67,200' },
  'Detailed': { population: '715,522', income: '$68,400' },
  'Comparison': { population: '715,522 vs 442,000', income: '$68,400 vs $72,100' }
};

@Component({
  selector: 'app-census-demo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './census-demo.component.html',
  styleUrls: ['./census-demo.component.scss']
})
export class CensusDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainerRef!: ElementRef<HTMLDivElement>;
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: '<p><strong>Welcome to the Census Data Assistant.</strong> Ask me questions about demographics in plain English.</p><p>Try:</p><ul><li>What\'s the population and median income for census tract 1234 in Denver?</li><li>Compare poverty rates between these two ZIP codes</li><li>Show me demographic breakdown for urban planning in Austin</li></ul>'
    }
  ];
  queryInput = '';
  sendDisabled = false;
  reportVisible = false;
  reportDate = '';
  reportContent = '';
  reportBtnText = 'Generate Urban Planning Report';
  reportBtnDisabled = false;
  suggestedQueries = SUGGESTED_QUERIES;
  statusActive: Record<string, boolean> = {};
  selectedRegion = 'Seattle';
  boundarySelect = 'Census tract';
  dataPopCount = '4,231';
  dataDensity = '10.2/sq mi';
  reportVariant = 'Standard';
  dataPopulation = '715,522';
  dataIncome = '$68,400';
  chartBars = [45, 72, 58, 85, 62, 78, 55, 90];
  boundaryOptions = ['Census tract', 'County', 'ZIP code', 'Block group'];
  variantOptions = ['Standard', 'Summary', 'Detailed', 'Comparison'];
  mapRegions = [
    { id: 1, name: 'Seattle', lat: 47.6062, lng: -122.3321 },
    { id: 2, name: 'Denver', lat: 39.7392, lng: -104.9903 },
    { id: 3, name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { id: 4, name: 'Austin', lat: 30.2672, lng: -97.7431 },
    { id: 5, name: 'Phoenix', lat: 33.4484, lng: -112.074 }
  ];

  get hasQueryResults(): boolean {
    return this.messages.some(m => m.role === 'user');
  }

  constructor(private sanitizer: DomSanitizer) {
    this.messages[0].safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.messages[0].content);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];
    this.map?.remove();
    this.map = null;
  }

  private initMap(): void {
    const el = this.mapContainerRef?.nativeElement;
    if (!el) return;

    // Delay so layout is ready and tiles load properly
    setTimeout(() => {
      if (!el.parentElement) return;

      this.map = L.map(el, {
        center: [39.5, -98.5],
        zoom: 4,
        zoomControl: false
      });

      // CARTO tiles - reliable loading, no API key
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(this.map);

      L.control.zoom({ position: 'bottomright' }).addTo(this.map);

      this.addCityMarkers();
      this.map.invalidateSize();
    }, 100);
  }

  private addCityMarkers(): void {
    if (!this.map) return;
    this.markers.forEach(m => m.remove());
    this.markers = [];

    for (const region of this.mapRegions) {
      const isSelected = this.selectedRegion === region.name;
      const icon = L.divIcon({
        className: 'city-marker',
        html: `<button type="button" class="map-region ${isSelected ? 'highlighted' : ''}"><span class="region-label">${region.name}</span></button>`,
        iconSize: [90, 70],
        iconAnchor: [45, 35]
      });

      const marker = L.marker([region.lat, region.lng], { icon });
      marker.on('click', () => this.onSelectRegion(region));
      marker.addTo(this.map!);
      this.markers.push(marker);
    }
  }

  private matchQuery(q: string): string {
    const lower = q.toLowerCase();
    if (lower.includes('income') && (lower.includes('seattle') || lower.includes('tract') || lower.includes('5301'))) return 'income';
    if (lower.includes('density') || (lower.includes('denver') && lower.includes('boulder'))) return 'density';
    if (lower.includes('poverty') || lower.includes('chicago')) return 'poverty';
    if (lower.includes('austin') || lower.includes('urban planning')) return 'austin';
    return 'default';
  }

  private getResponseHtml(key: string): string {
    const r = RESPONSES[key] ?? RESPONSES['default'];
    let html = r.text;
    if (r.table) {
      html += '<table><thead><tr>' + r.table.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
        r.table.rows.map(row => '<tr>' + row.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
    }
    return html;
  }

  private showStatus(): void {
    const ids = ['statusOpenAI', 'statusSageMaker', 'statusRAG', 'statusCensus'];
    ids.forEach((id, i) => {
      setTimeout(() => { this.statusActive[id] = true; }, i * 400);
    });
    setTimeout(() => {
      ids.forEach(id => { this.statusActive[id] = false; });
    }, 2500);
  }

  addMessage(role: 'user' | 'assistant' | 'system', content: string): void {
    const msg: ChatMessage = { role, content };
    if (role === 'assistant' || role === 'system') {
      msg.safeHtml = this.sanitizer.bypassSecurityTrustHtml(content);
    }
    this.messages.push(msg);
    setTimeout(() => {
      const el = document.querySelector('.chat-messages .msg:last-child');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  onSend(): void {
    const q = this.queryInput.trim();
    if (!q || this.sendDisabled) return;
    this.queryInput = '';
    this.addMessage('user', q);
    this.sendDisabled = true;
    this.showStatus();
    this.addMessage('system', 'Parsing natural language query...');
    setTimeout(() => {
      this.addMessage('system', 'Querying LangChain geospatial RAG — retrieving Census boundary layers...');
    }, 600);
    setTimeout(() => {
      this.addMessage('system', 'SageMaker generating insights from Census tract data...');
    }, 1200);
    setTimeout(() => {
      const key = this.matchQuery(q);
      this.addMessage('assistant', this.getResponseHtml(key));
      this.updateDashboardFromKey(key);
      this.addCityMarkers();
      this.sendDisabled = false;
    }, 2200);
  }

  private updateDashboardFromKey(key: string): void {
    const updates: Record<string, Partial<{ selectedRegion: string; boundarySelect: string; dataPopCount: string; dataDensity: string; dataPopulation: string; dataIncome: string }>> = {
      income: { selectedRegion: 'Seattle', dataPopCount: '4,231', dataDensity: '10.2/sq mi', dataPopulation: '715,522', dataIncome: '$78,432' },
      density: { selectedRegion: 'Denver', boundarySelect: 'County', dataPopCount: '715,522', dataDensity: '4,674/sq mi', dataPopulation: '715,522', dataIncome: '$68,400' },
      poverty: { selectedRegion: 'Chicago', dataPopCount: '12,450', dataDensity: '18.2/sq mi', dataPopulation: '2,700,000', dataIncome: '$52,100' },
      austin: { selectedRegion: 'Austin', dataPopCount: '1,028,220', dataDensity: '1,389/sq mi', dataPopulation: '1,028,220', dataIncome: '$78,965' }
    };
    const u = updates[key];
    if (u) {
      Object.assign(this, u);
    }
  }

  onSelectRegion(region: { name: string }): void {
    this.selectedRegion = region.name;
    const d = REGION_DATA[region.name];
    if (d) {
      this.dataPopCount = d.popCount;
      this.dataDensity = d.density;
      this.dataPopulation = d.population;
      this.dataIncome = d.income;
      this.chartBars = this.chartBars.map(() => 40 + Math.floor(Math.random() * 55));
    }
    this.addCityMarkers();
  }

  onBoundaryChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.boundarySelect = val;
    const d = BOUNDARY_DATA[val];
    if (d) {
      this.dataPopCount = d.popCount;
      this.dataDensity = d.density;
    }
  }

  onReportVariantChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.reportVariant = val;
    const d = VARIANT_DATA[val];
    if (d) {
      this.dataPopulation = d.population;
      this.dataIncome = d.income;
    }
  }

  onCompare(): void {
    this.queryInput = 'Compare population density between Denver and Boulder counties';
    this.onSend();
  }

  onQuickQuerySelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    (event.target as HTMLSelectElement).value = '';
    if (val) {
      this.queryInput = val;
      this.onSend();
    }
  }

  clearResults(): void {
    this.messages = [
      { role: 'assistant', content: '<p><strong>Welcome.</strong> Ask about demographics in plain English.</p>', safeHtml: this.sanitizer.bypassSecurityTrustHtml('<p><strong>Welcome.</strong> Ask about demographics in plain English.</p>') }
    ];
  }

  onSuggestedQuery(query: string): void {
    this.queryInput = query;
    this.onSend();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.onSend();
  }

  onGenerateReport(): void {
    if (this.reportBtnDisabled) return;
    this.reportBtnDisabled = true;
    this.reportBtnText = 'Generating...';
    this.addMessage('system', 'Initiating automated report generation...');
    this.showStatus();
    setTimeout(() => {
      this.addMessage('system', 'SageMaker processing demographic analysis...');
    }, 800);
    setTimeout(() => {
      this.reportDate = new Date().toLocaleString();
      const html = `
        <h4>Executive Summary</h4>
        <p>This AI-generated report synthesizes Census tract data across the target geography. Key demographic indicators have been extracted and analyzed using our SageMaker-trained models.</p>
        <h4>Demographic Overview</h4>
        <ul>
          <li><strong>Population:</strong> 715,000+ across 179 census tracts</li>
          <li><strong>Median Household Income:</strong> $68,400 (MSA average)</li>
          <li><strong>Poverty Rate:</strong> 10.2% (below national average)</li>
          <li><strong>Housing:</strong> 68% owner-occupied, 32% renter-occupied</li>
        </ul>
        <h4>Urban Planning Recommendations</h4>
        <p>Based on boundary data and demographic patterns: Consider mixed-use zoning in high-density tracts 5301–5310. Transit-oriented development opportunities identified in 12 tracts. Affordable housing gap analysis suggests need in 8 southern tracts.</p>
        <p><em>Report generated by Vector Scope AI — FISMA-compliant geospatial AI pipeline. Estimated time saved vs. manual analysis: 15+ hours.</em></p>
      `;
      this.reportContent = html;
      this.reportVisible = true;
      this.reportBtnDisabled = false;
      this.reportBtnText = 'Generate Urban Planning Report';
      setTimeout(() => {
        document.getElementById('reportPreview')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2500);
  }
}
