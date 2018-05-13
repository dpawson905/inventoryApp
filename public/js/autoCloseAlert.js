"use strict";
/* global $ */
$(document).ready(function() {
  $(".alert-success")
    .fadeTo(2000, 500)
    .slideUp(500, function() {
      $(".alert-succcess").slideUp(500);
    });

  $(".alert-danger")
    .fadeTo(2000, 500)
    .slideUp(500, function() {
      $(".alert-danger").slideUp(500);
    });
});
