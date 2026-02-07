export function initHeaderMenu() {
    // ссылки в главном меню на десктопе
    const catalogLinkEl = document.getElementById("catalog-link");
    const researchLinkEl = document.getElementById("research-link");
    //layout, который выдвигается слева по нажатию ссылок из главного меню и боковые меню
    const submenuLayoutEl = document.getElementById("submenu-layout");
    const catalogSubmenuEl = document.getElementById("catalog-submenu");
    const researchSubmenuEl = document.getElementById("research-submenu");
    // overlay-слой
    const overlayEl = document.getElementById("overlay");

    // ссылки внутри первого бокового меню и области для генерации второго бокового меню на десктопе
    const catalogMenuLinkEls = document.querySelectorAll('#catalog-submenu .submenu-items .common-link');
    const catalogSecondMenuEl = document.getElementById("catalog-second-submenu");
    const secondCatalogMenuListEls = document.querySelectorAll('#catalog-second-submenu .submenu-items');

    // бургерное меню, header, который сдвигается наверх при нажатии на бургер, и ссылки для перемещения назад в другое меню ссылок
    const burgerMenuEl = document.getElementById('burger');
    const headerEl = document.getElementById('header');
    const backLinkEls = document.querySelectorAll('.back-link .common-link');
    // мобильное главное меню
    const headerMobileMenuEl = document.getElementById('header-mobile-menu');

    // события и функции
    // закрытие всех активных классов для меню и лайаута
    const refreshMenu = () => {
        document.body.style.overflow = "unset";
        catalogLinkEl.classList.remove("active");
        researchLinkEl.classList.remove("active");
        submenuLayoutEl.classList.remove("open");
        catalogSubmenuEl.classList.remove("open");
        researchSubmenuEl.classList.remove("open");
        submenuLayoutEl.classList.remove("two-menus");
        headerMobileMenuEl.classList.remove("open");
        burgerMenuEl.classList.remove("open");
        headerEl.classList.remove("closed");

        catalogSecondMenuEl.classList.remove("open");
        catalogMenuLinkEls.forEach((linkEl) => linkEl.classList.remove("active"));

        overlayEl.classList.remove("open");
    }
    // создание обработчиков для ссылок, которые открывают первое боковое меню
    const initSubmenu = () => {
        catalogLinkEl.addEventListener("click", () => {
            if (catalogLinkEl.classList.contains("active")) {
                catalogLinkEl.classList.remove("active");
                refreshMenu();
                return;
            }
            refreshMenu();
            overlayEl.classList.add("open");
            document.body.style.overflow = "hidden";

            catalogLinkEl.classList.add("active");
            researchLinkEl.classList.remove("active");

            researchSubmenuEl.classList.remove("open");
            catalogSubmenuEl.classList.add("open");

            if (!submenuLayoutEl.classList.contains("open")) {
                submenuLayoutEl.classList.add("open");
            }
        });

        researchLinkEl.addEventListener("click", () => {
            if (researchLinkEl.classList.contains("active")) {
                researchLinkEl.classList.remove("active");
                refreshMenu();
                return;
            }

            refreshMenu();
            overlayEl.classList.add("open");
            document.body.style.overflow = "hidden";

            researchLinkEl.classList.add("active");
            catalogLinkEl.classList.remove("active");

            researchSubmenuEl.classList.add("open");
            catalogSubmenuEl.classList.remove("open");

            if (!submenuLayoutEl.classList.contains("open")) {
                submenuLayoutEl.classList.add("open");
            }
        });
    };
    // обработчик для каждой ссылки второго бокового меню
    const initSecondSubmenu = () => {
        catalogMenuLinkEls.forEach(link => {
            link.addEventListener('click', () => {
                if(link.classList.contains("active")) {
                    link.classList.remove("active");
                    submenuLayoutEl.classList.remove("two-menus");
                    secondCatalogMenuListEls.forEach(menuList => menuList.style.display = "none");
                    return;
                }
                catalogMenuLinkEls.forEach(linkEl => linkEl.classList.remove("active"));
                secondCatalogMenuListEls.forEach(menuList => menuList.style.display = "none");

                link.classList.add('active');
                burgerMenuEl.classList.contains("open") ? catalogSubmenuEl.classList.remove("open") :
                    submenuLayoutEl.classList.add("two-menus");

                const kptd = link.dataset.kptd;                   // Получаем номер КПТД из data-атрибута
                catalogSecondMenuEl.classList.add('open');

                const kptdMenuListEl = document.getElementById(`kptd-menu-list-${kptd}`);
                kptdMenuListEl.style.display = "flex";
            });
        });
    };
    // обработчик для генерации бургерного меню
    const initBurgerMenu = () => {
        burgerMenuEl.addEventListener('click', () => {
            burgerMenuEl.classList.contains('open') ? refreshMenu() : burgerMenuEl.classList.add('open');

            if (burgerMenuEl.classList.contains('open')) {
                overlayEl.classList.add("open");
                document.body.style.overflow = "hidden";
                submenuLayoutEl.classList.add("open");
                headerEl.classList.add("closed");
                headerMobileMenuEl.classList.add("open");
            } else {
                overlayEl.classList.remove("open");
                document.body.style.overflow = "unset";
                submenuLayoutEl.classList.remove("open");
                headerEl.classList.remove("closed");
            }
        });
    };
    // создание обработчиков для ссылок, которые открывают боковое меню по нажатию на бургер
    // (а также ссылок назад для перемещения между меню)
    const initMobileSubmenu = () => {
        // ссылки внутри мобильного главного меню
        const catalogLinkEl1 = document.getElementById('catalog-link-1');
        const researchLinkEl1 = document.getElementById('research-link-1');

        catalogLinkEl1.addEventListener('click', () => {
            headerMobileMenuEl.classList.remove("open");
            catalogSubmenuEl.classList.add("open");
            researchSubmenuEl.classList.remove("open");
        });

        researchLinkEl1.addEventListener('click', () => {
            headerMobileMenuEl.classList.remove("open");
            catalogSubmenuEl.classList.remove("open");
            researchSubmenuEl.classList.add("open");
        });

        backLinkEls.forEach(link => {
            link.addEventListener('click', () => {
                if (catalogSubmenuEl.classList.contains('open')) {
                    headerMobileMenuEl.classList.add("open");
                    catalogSubmenuEl.classList.remove("open");
                    secondCatalogMenuListEls.forEach(menuList => menuList.style.display = "none");
                } else if (researchSubmenuEl.classList.contains('open')) {
                    headerMobileMenuEl.classList.add("open");
                    researchSubmenuEl.classList.remove("open");
                } else if (catalogSecondMenuEl.classList.contains('open')) {
                    catalogMenuLinkEls.forEach(linkEl => linkEl.classList.remove("active"));
                    catalogSubmenuEl.classList.add("open");
                    catalogSecondMenuEl.classList.remove("open");
                    secondCatalogMenuListEls.forEach(menuList => menuList.style.display = "none");
                }
            });
        })
    };
    // обработчики для создания логики закрытия меню при различных событиях
    const initCloseEffects = () => {
        // при нажатии на overlay слой меню закрывается
        overlayEl.addEventListener("click", () => refreshMenu());
        // при нажатии на Esc меню закрывается
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") refreshMenu();
        });
        // при изменении размеров окна сбрасываются все активные классы меню
        window.addEventListener('resize', refreshMenu);
    };

    // инициализация всех обработчиков и событий
    initSubmenu();
    initSecondSubmenu();
    initBurgerMenu();
    initMobileSubmenu();
    initCloseEffects();
}