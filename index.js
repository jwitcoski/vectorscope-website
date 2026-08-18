// initialization

const RESPONSIVE_WIDTH = 1024

let headerWhiteBg = false
let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH
const collapseBtn = document.getElementById("collapse-btn")
const collapseHeaderItems = document.getElementById("collapsed-header-items")



function onHeaderClickOutside(e) {

    if (!collapseHeaderItems.contains(e.target)) {
        toggleHeader()
    }

}


function toggleHeader() {
    if (isHeaderCollapsed) {
        // collapseHeaderItems.classList.remove("max-md:tw-opacity-0")
        collapseHeaderItems.classList.add("opacity-100",)
        collapseHeaderItems.style.width = "60vw"
        collapseBtn.classList.remove("bi-list")
        collapseBtn.classList.add("bi-x", "max-lg:tw-fixed")
        isHeaderCollapsed = false

        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1)

    } else {
        collapseHeaderItems.classList.remove("opacity-100")
        collapseHeaderItems.style.width = "0vw"
        collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed")
        collapseBtn.classList.add("bi-list")
        isHeaderCollapsed = true
        window.removeEventListener("click", onHeaderClickOutside)

    }
}

function responsive() {
    if (window.innerWidth > RESPONSIVE_WIDTH) {
        collapseHeaderItems.style.width = ""

    } else {
        isHeaderCollapsed = true
    }
}

window.addEventListener("resize", responsive)

function syncLedgerEmbed() {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches
    const desktop = document.querySelector(".playground-desktop")
    const phone = document.querySelector(".playground-phone")
    if (desktop) desktop.hidden = !isDesktop
    if (phone) phone.hidden = isDesktop

    const iframe = document.getElementById("ledger-embed")
    if (!iframe) return

    const src = iframe.getAttribute("data-src")
    if (!src) return

    if (isDesktop) {
        if (iframe.getAttribute("src") !== src) {
            iframe.src = src
        }
    } else if (iframe.getAttribute("src")) {
        iframe.removeAttribute("src")
    }
}

syncLedgerEmbed()
const desktopPlaygroundQuery = window.matchMedia("(min-width: 1024px)")
if (typeof desktopPlaygroundQuery.addEventListener === "function") {
    desktopPlaygroundQuery.addEventListener("change", syncLedgerEmbed)
} else if (typeof desktopPlaygroundQuery.addListener === "function") {
    desktopPlaygroundQuery.addListener(syncLedgerEmbed)
}


/**
 * Animations
 */

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)

    gsap.to(".reveal-hero-text", {
        opacity: 0,
        y: "100%",
    })

    gsap.to(".reveal-up", {
        opacity: 0,
        y: "100%",
    })

    const heroImgBg = document.getElementById("hero-img-bg")
    if (heroImgBg) {
        gsap.to(heroImgBg, { scale: 0 })
    }

    const revealHeroImg = document.querySelector(".reveal-hero-img")
    if (revealHeroImg) {
        gsap.to(revealHeroImg, { opacity: 0, y: "100%" })
    }

    window.addEventListener("load", () => {
        gsap.to(".reveal-hero-text", {
            opacity: 1,
            y: "0%",
            duration: 0.8,
            stagger: 0.5,
        })

        if (heroImgBg) {
            gsap.to(heroImgBg, {
                scale: 1,
                duration: 0.8,
                delay: 0.4,
            })
        }

        if (revealHeroImg) {
            gsap.to(revealHeroImg, { opacity: 1, y: "0%" })
        }
    })
}

// ------------- reveal section animations ---------------

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    const sections = gsap.utils.toArray("section")
    sections.forEach((sec) => {
        const revealUptimeline = gsap.timeline({
            paused: true,
            scrollTrigger: {
                trigger: sec,
                start: "10% 80%",
                end: "20% 90%",
            },
        })
        revealUptimeline.to(sec.querySelectorAll(".reveal-up"), {
            opacity: 1,
            duration: 0.8,
            y: "0%",
            stagger: 0.2,
        })
    })
}



