$(document).ready(async function () {
  serviceClick();
  productArrow();
});

function serviceClick() {
  var first = $(".services .tabs button")[0];
  $(first).addClass("active");
  var firstId = $(first).attr('id');
  $(`.services .features-section .container`).hide();
  $(`.services .features-section #${firstId}.container`).show();

  $(".services .tabs button").on("click", (e) => {
    $(".services .tabs button").removeClass("active");
    $(e.currentTarget).addClass("active");

    var id = $(e.currentTarget).attr('id');
    $(`.services .features-section .container`).hide();
    $(`.services .features-section #${id}.container`).show();
  });
}

function productArrow() {
  const leftArrow = document.querySelector("#product-left-arrow");
  const rightArrow = document.querySelector("#product-right-arrow");
  const postsContainer = document.querySelector(".posts-container");
  const card = document.querySelector(".card");
  const cardWidth = card.clientWidth;

  const scrollAmount = cardWidth + 40;

  leftArrow.addEventListener("click", function () {
    postsContainer.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  rightArrow.addEventListener("click", function () {
    postsContainer.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });
}