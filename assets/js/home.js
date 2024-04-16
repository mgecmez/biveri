$(document).ready(async function () {
  serviceClick();
  productArrow();
});

function serviceClick() {
  $(".services .tabs button").on("click", (e) => {
    $(".services .tabs button").removeClass("active");
    $(e.currentTarget).addClass("active");
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