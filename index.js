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



