function initialiserSommaireDeroulant() {
  const sommaire = document.querySelector(
    ".md-sidebar--secondary .md-nav--secondary"
  );

  if (!sommaire) {
    console.warn("Sommaire secondaire introuvable");
    return;
  }

  const rubriques = sommaire.querySelectorAll(
    ".md-nav__item"
  );

  rubriques.forEach((rubrique) => {
    const lien = rubrique.querySelector(
      ":scope > .md-nav__link"
    );

    const sousMenu = rubrique.querySelector(
      ":scope > .md-nav"
    );

    if (!lien || !sousMenu) return;
    if (rubrique.dataset.deroulant === "true") return;

    rubrique.dataset.deroulant = "true";
    rubrique.classList.add("toc-deroulant");

    const contientTitreActif = Boolean(
      rubrique.querySelector(".md-nav__link--active")
    );

    if (!contientTitreActif) {
      rubrique.classList.add("toc-deroulant--ferme");
    }

    const bouton = document.createElement("button");

    bouton.type = "button";
    bouton.className = "toc-deroulant__bouton";
    bouton.setAttribute(
      "aria-label",
      "Afficher ou masquer les sous-titres"
    );
    bouton.setAttribute(
      "aria-expanded",
      contientTitreActif ? "true" : "false"
    );
    bouton.textContent = "›";

    bouton.addEventListener("click", (evenement) => {
      evenement.preventDefault();
      evenement.stopPropagation();

      const estFerme = rubrique.classList.toggle(
        "toc-deroulant--ferme"
      );

      bouton.setAttribute(
        "aria-expanded",
        estFerme ? "false" : "true"
      );
    });

    lien.appendChild(bouton);
  });
}

function chargerSommaireDeroulant() {
  /*
   * requestAnimationFrame laisse à Material le temps
   * de générer le sommaire de la page.
   */
  window.requestAnimationFrame(
    initialiserSommaireDeroulant
  );
}

if (typeof document$ !== "undefined") {
  document$.subscribe(chargerSommaireDeroulant);
} else if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    chargerSommaireDeroulant
  );
} else {
  chargerSommaireDeroulant();
}