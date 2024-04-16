$(document).ready(async function () {
  menuHover();
});

function menuHover() {
  $(".menu-item-base").hover(
    function () {
      $(this).find(".header-dropdown").addClass("show");
      $(".hero-header-section").addClass("active");
    },
    function () {
      $(this).find(".header-dropdown").removeClass("show");
      $(".hero-header-section").removeClass("active");
    }
  );
}
