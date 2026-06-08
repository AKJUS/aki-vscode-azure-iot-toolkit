document.addEventListener("DOMContentLoaded", function () {
    main();
});

function main() {
    const vscode = acquireVsCodeApi();

    document.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const anchor = event.currentTarget;
            if (anchor && anchor.href) {
                vscode.postMessage({
                    href: anchor.href
                });
            }
        });
    });

    document.querySelectorAll(".interactive").forEach(function (el) {
        el.addEventListener("click", function (event) {
            const target = event.target;
            if (target.tagName === "A" || target.classList.contains("detail") ||
                target.closest(".detail")) {
                return;
            }
            const detail = el.querySelector(".detail");
            if (detail) {
                detail.style.display = detail.style.display === "none" ? "" : "none";
            }
            const arrow = el.querySelector(".arrow");
            if (arrow) {
                arrow.classList.toggle("arrow-up");
            }
            vscode.postMessage({
                href: "toggle:" + el.id
            });
        });
    });

    window.addEventListener("scroll", function () {
        const offset = 250;
        const backToTop = document.getElementById("back-to-top");
        if (backToTop) {
            if (window.scrollY >= offset) {
                backToTop.style.display = "block";
                backToTop.style.opacity = "1";
                backToTop.style.visibility = "visible";
            } else {
                backToTop.style.opacity = "0";
                backToTop.style.visibility = "hidden";
                backToTop.style.display = "none";
            }
        }
    });
}