$(document).ready(async function () {
  featureMoreLess();
  faqMoreLess();
});

function featureMoreLess() {
  $('.features-section .feature-tab .button').on('click', (e) => {
    $('.feature-tab').removeClass('active');
    var parent = $(e.currentTarget).parent();
    $(parent).addClass('active');
  });
}

function faqMoreLess() {
  var description = $('.faq-section .faq-item .description').hide();

  $('.faq-section .faq-item .icon-wrap').click(function() {
    $this = $(this);

    var faqItem = $(this).closest('.faq-item');
    var isActive = faqItem.hasClass('active');
    var $target =  faqItem.find('.description');

    $('.faq-item').removeClass('active');
    description.slideUp('fast');
    
    if (!isActive) {
      faqItem.addClass('active');
      $target.slideDown('fast');
    }
  });
}