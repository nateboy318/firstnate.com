jQuery(document).ready(function() {
    jQuery('.tabs .tab-links a').on('click', function(e)  {
        var currentAttrValue = jQuery(this).attr('href');
 
        // Show/Hide Tabs
        jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
 
        // Change/remove current tab to active
        jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
    });
});
jQuery(document).ready(function() {
    // Code Here
});
jQuery('.tab-links a').on('click', function(e)  {
    // More Code Here
});
var currentAttrValue = jQuery(this).attr('href');
jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
e.preventDefault();// Show/Hide Tabs
jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
1
2
// Show/Hide Tabs
jQuery('.tabs ' + currentAttrValue).fadeIn(400).siblings().hide();
1
2
3
// Show/Hide Tabs
jQuery('.tabs ' + currentAttrValue).siblings().slideUp(400);
jQuery('.tabs ' + currentAttrValue).delay(400).slideDown(400);
1
2
// Show/Hide Tabs
jQuery('.tabs ' + currentAttrValue).slideDown(400).siblings().slideUp(400);
