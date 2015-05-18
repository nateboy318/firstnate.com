(function () {     
3 
 
4     var Skippr = (function () { 
5 
 
6         function Skippr(element, options) { 
7 
 
8         	var _ = this, 
9                 timer; 
10              
11             _.settings = $.extend($.fn.skippr.defaults, options); 
12             _.$element = $(element); 
13             _.$parent = _.$element.parent(); 
14             _.$photos = _.$element.children(); 
15 			_.count = _.$photos.length; 
16             _.countString = String(_.count); 
17             _.touchOnThis = false; 
18             _.previousTouchX = null; 
19             _.swipeDirection = null; 
20 			_.init(); 
21      
22         } 
23 
 
24         Skippr.prototype.init = function() { 
25 
 
26         	var _ = this; 
27 
 
28         	_.setup(); 
29         	_.navClick(); 
30             _.arrowClick(); 
31             _.resize(); 
32             _.keyPress(); 
33 
 
34             if(_.settings.autoPlay == true) { 
35                 _.autoPlay(); 
36                 _.autoPlayPause(); 
37             } 
38 
 
39             if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { 
40                 _.touch(); 
41             } 
42 
 
43 
 
44         } 
45          
46         // Set event listeners for touch events. 
47         //  
48         Skippr.prototype.touch = function() { 
49 
 
50             var _ = this; 
51 
 
52             _.$element.on('touchstart', function(ev) { 
53 
 
54                 var e = ev.originalEvent; 
55                 var xcoord = e.pageX; 
56 
 
57                 // Record that this element is being touched. 
58                 _.touchOnThis = true; 
59                 // Record the current xcoord to be used as reference in 
60                 // touchmove event listener. 
61                 _.previousTouchX = xcoord; 
62             }); 
63 
 
64             _.$element.on('touchmove', function(ev) { 
65 
 
66                 var e = ev.originalEvent; 
67                 var xcoord = e.pageX; 
68 
 
69                 if(_.touchOnThis) { 
70                     e.preventDefault(); 
71 
 
72                     if(_.previousTouchX < xcoord) { 
73                         // swiping right to go backwards 
74                         _.swipeDirection = "backwards"; 
75 
 
76                     } else if(_.previousTouchX > xcoord) { 
77                         //swiping left to go forwards 
78                         _.swipeDirection = "forwards"; 
79 
 
80                     } 
81 
 
82                 } 
83 
 
84             }); 
85 
 
86             _.$element.on('touchend', function() { 
87 
 
88                 _.touchOnThis = false; 
89 
 
90                 // Trigger arrow event listeners depending 
91                 // on swipe direction. 
92                 if(_.swipeDirection == "backwards") { 
93 
 
94                     _.$element.find(".skippr-previous").trigger('click'); 
95      
96                 } else if(_.swipeDirection == "forwards") { 
97 
 
98                     _.$element.find(".skippr-next").trigger('click'); 
99              
100                 } 
101 
 
102                 // Reset in order to prevent event listeners 
103                 // from responding to taps. 
104                 _.swipeDirection = null; 
105 
 
106             });  
107 
 
108         } 
109 
 
110         Skippr.prototype.setup = function() { 
111 
 
112         	var _ = this; 
113              
114             // if img elements are being used, 
115             // create divs with background images to use 
116             // Skippr as normal.   
117             if (_.settings.childrenElementType == 'img') { 
118 
 
119                 var makeDivs = []; 
120 
 
121                 for (i = 0; i < _.count; i++) { 
122                     var src = _.$photos.eq(i).attr('src'), 
123                         insert = '<div style="background-image: url(' + src + ')"></div>'; 
124 
 
125                     makeDivs.push(insert); 
126                 } 
127                  makeDivs.join(""); 
128                  _.$element.append(makeDivs); 
129                  _.$element.find('img').remove(); 
130                  _.$photos = _.$element.children(); 
131 
 
132             } 
133 
 
134             // if an array of image url's is being used 
135             // create divs with background images to use 
136             // Skippr as normal. 
137             if (_.settings.childrenElementType == 'array') { 
138                  
139                 var imageArray = _.settings.imgArray; 
140                 var makeDivs = []; 
141 
 
142                 for (i = 0; i < imageArray.length; i++) { 
143                     var src = imageArray[i]; 
144                     var insert = '<div style="background-image: url(' + src + ')"></div>'; 
145 
 
146                     makeDivs.push(insert); 
147                 } 
148 
 
149                 makeDivs.join(""); 
150                 _.$element.append(makeDivs); 
151                 _.$photos = _.$element.children(); 
152                 // Reset the count property to reflect the new elements. 
153                 _.count = _.$photos.length; 
154 
 
155             } 
156 
 
157             if (_.settings.transition == 'fade') { 
158                 _.$photos.not(":first-child").hide(); 
159             } 
160 
 
161             if (_.settings.transition == 'slide') { 
162                 _.setupSlider(); 
163 
 
164             } 
165 
 
166         	_.$photos.eq(0).addClass('visible'); 
167         	_.$element.addClass('skippr'); 
168 
 
169         	_.navBuild(); 
170 
 
171             if(_.settings.arrows == true) { 
172                 _.arrowBuild(); 
173             } 
174 
 
175         }; 
176 
 
177         Skippr.prototype.resize = function() { 
178 
 
179             var _ = this; 
180 
 
181             if( _.settings.transition == 'slide') { 
182                  
183                 $(window).resize(function() { 
184          
185                     var currentItem = _.$element.find(".skippr-nav-element-active").attr('data-slider'); 
186 
 
187                     _.setupSlider(); 
188 
 
189                     _.$photos.each(function() { 
190                         var amountLeft = parseFloat($(this).css('left')), 
191                             parentWidth = _.$parent.width(), 
192                             moveAmount; 
193 
 
194                         if( currentItem > 1 ) { 
195                             moveAmount = amountLeft - (parentWidth * (currentItem - 1)); 
196                         } 
197                         $(this).css('left', moveAmount + 'px'); 
198                     }); 
199 
 
200                     // Corrects autoPlay timer 
201                     if(_.settings.autoPlay === true ) { 
202                         clearInterval(timer); 
203                         _.autoPlay(); 
204                     }     
205 
 
206                 }); 
207             } 
208         }; 
209 
 
210         Skippr.prototype.arrowBuild = function() { 
211 
 
212             var _ = this, 
213                 previous, 
214                 next, 
215                 startingPrevious = _.count, // what will be the first previous slide? 
216                 previousStyles = ''; 
217 
 
218             if ( _.settings.hidePrevious === true ) { 
219                 previousStyles = 'style="display:none;"';  
220             } 
221 
 
222             previous = '<nav class="skippr-nav-item skippr-arrow skippr-previous" data-slider="' + startingPrevious + '" ' + previousStyles + '></nav>'; 
223             next = '<nav class="skippr-nav-item skippr-arrow skippr-next" data-slider="2"></nav>'; 
224 
 
225             _.$element.append(previous + next); 
226 
 
227         }; 
228 
 
229         Skippr.prototype.navBuild = function() { 
230 
 
231         	var _ = this, 
232         		container, 
233         		navElements = []; 
234 
 
235             if (_.settings.navType == "block") { 
236                 var styleClass = "skippr-nav-element-block"; 
237             } else if(_.settings.navType == "bubble") { 
238                var styleClass = "skippr-nav-element-bubble";  
239             } 
240 
 
241         	for (var i = 0; i < _.count; i++) {  
242         		//cycle through slideshow divs and display correct number of bubbles. 
243         		var insert; 
244 
 
245         		if (i == 0) { 
246         			//check if first bubble, add respective active class. 
247         	 		insert = "<div class='skippr-nav-element skippr-nav-item " + styleClass + " skippr-nav-element-active' data-slider='" + (i + 1) + "'></div>"; 
248         		} else { 
249         			insert = "<div class='skippr-nav-element skippr-nav-item " + styleClass + "' data-slider='" + (i + 1) + "'></div>"; 
250         		} 
251         		//insert bubbles into an array. 
252         		navElements.push(insert);  
253         	}; 
254         	//join array elements into a single string. 
255         	navElements = navElements.join("");  
256         	// append html to bubbles container div. 
257         	container = '<nav class="skippr-nav-container">' + navElements + '</nav>'; 
258 
 
259         	_.$element.append(container); 
260 
 
261         }; 
262 
 
263         Skippr.prototype.arrowClick = function() { 
264              
265             var _ = this, 
266                 $arrows = _.$element.find(".skippr-arrow"); 
267              
268             $arrows.click(function(){ 
269                 
270                 if ( !$(this).hasClass('disabled') ) { 
271                     _.change($(this));   
272                 } 
273                  
274             }); 
275 
 
276         }; 
277 
 
278         Skippr.prototype.navClick = function() { 
279 
 
280         	var _ = this, 
281                 $navs = _.$element.find('.skippr-nav-element'); 
282 
 
283         	$navs.click(function(){ 
284 
 
285                 if ( !$(this).hasClass('disabled') ) { 
286                     _.change($(this)); 
287                 } 
288         	}); 
289 
 
290         }; 
291 
 
292         Skippr.prototype.change = function(element) { 
293 
 
294             var _ = this, 
295                 item = element.attr('data-slider'), 
296                 allNavItems = _.$element.find(".skippr-nav-item"), 
297                 currentItem = _.$element.find(".skippr-nav-element-active").attr('data-slider'), 
298                 nextData = _.$element.find(".skippr-next").attr('data-slider'), 
299                 previousData = _.$element.find(".skippr-previous").attr('data-slider'); 
300 
 
301             if(item != currentItem) { //prevents animation for repeat click. 
302 
 
303                 if (_.settings.transition == 'fade') { 
304 
 
305                     _.$photos.eq(item - 1).css('z-index', '10').siblings('div').css('z-index', '9'); 
306                      
307                     _.$photos.eq(item - 1).fadeIn(_.settings.speed, function() { 
308                         _.$element.find(".visible").fadeOut('fast',function(){ 
309                             $(this).removeClass('visible'); 
310                             _.$photos.eq(item - 1).addClass('visible'); 
311                         }); 
312                     });  
313                 } 
314 
 
315                 if (_.settings.transition == 'slide') { 
316                    
317                     _.$photos.each(function(){ 
318 
 
319                         var amountLeft = parseFloat($(this).css('left')), 
320                             parentWidth = _.$parent.width(), 
321                             moveAmount; 
322 
 
323                         if (item > currentItem) { 
324                             moveAmount = amountLeft - (parentWidth * (item - currentItem));  
325                         } 
326 
 
327                         if (item < currentItem) { 
328                             moveAmount = amountLeft + (parentWidth * (currentItem - item));                            
329                         } 
330 
 
331                         allNavItems.addClass('disabled'); 
332                          
333                         $(this).velocity({'left': moveAmount + 'px'}, _.settings.speed, _.settings.easing, function(){ 
334 
 
335                             allNavItems.removeClass('disabled'); 
336 
 
337                         }); 
338 
 
339                         _.logs("slides sliding"); 
340 
 
341                     }); 
342                 } 
343 
 
344 
 
345                 _.$element.find(".skippr-nav-element") 
346                           .eq(item - 1) 
347                           .addClass('skippr-nav-element-active') 
348                           .siblings() 
349                           .removeClass('skippr-nav-element-active'); 
350                  
351                 var nextDataAddString = Number(item) + 1, 
352                     previousDataAddString = Number(item) - 1; 
353 
 
354                 if ( item == _.count ){  
355                     _.$element.find(".skippr-next").attr('data-slider', '1' ); 
356                 } else { 
357                      _.$element.find(".skippr-next").attr('data-slider', nextDataAddString ); 
358                 } 
359                  
360                 if (item == 1) { 
361                      _.$element.find(".skippr-previous").attr('data-slider', _.countString ); 
362                 }  else { 
363                     _.$element.find(".skippr-previous").attr('data-slider', previousDataAddString );  
364                 } 
365 
 
366                 if( _.settings.arrows && _.settings.hidePrevious ) { 
367                     _.hidePrevious(); 
368                 }     
369             } 
370 
 
371         }; 
372 
 
373         Skippr.prototype.autoPlay = function() { 
374 
 
375             var _ = this; 
376 
 
377             timer = setInterval(function(){ 
378                 var activeElement =  _.$element.find(".skippr-nav-element-active"), 
379                     activeSlide = activeElement.attr('data-slider'); 
380 
 
381                 if( activeSlide == _.count ) { 
382                   var elementToInsert =  _.$element.find(".skippr-nav-element").eq(0);  
383                 } else { 
384                     var elementToInsert = activeElement.next(); 
385                 } 
386 
 
387                 _.change(elementToInsert); 
388                      
389             },_.settings.autoPlayDuration); 
390 
 
391         }; 
392 
 
393         Skippr.prototype.autoPlayPause = function() { 
394 
 
395             var _ = this; 
396 
 
397             // Set up a few listeners to clear and reset the autoPlay timer. 
398 
 
399             _.$parent.hover(function(){ 
400                 clearInterval(timer); 
401 
 
402                 _.logs("clearing timer on hover"); 
403 
 
404             }, function() { 
405                 _.autoPlay(); 
406 
 
407                 _.logs("resetting timer on un-hover"); 
408 
 
409             }); 
410 
 
411             // Checks if this tab is not being viewed, and pauses autoPlay timer if not.  
412             $(window).on("blur focus", function(e) { 
413 
 
414                 var prevType = $(this).data("prevType"); 
415 
 
416                 if (prevType != e.type) {   //  reduce double fire issues 
417                     switch (e.type) { 
418                         case "blur": 
419                             clearInterval(timer); 
420                             _.logs('clearing timer on window blur');  
421                             break; 
422                         case "focus": 
423                             _.autoPlay(); 
424                             _.logs('resetting timer on window focus'); 
425                             break; 
426                     } 
427                 } 
428 
 
429                 $(this).data("prevType", e.type); 
430             }); 
431 
 
432         }; 
433 
 
434         Skippr.prototype.setupSlider = function() { 
435 
 
436             var _ = this, 
437                 parentWidth = _.$parent.width(), 
438                 amountLeft; 
439 
 
440             _.$photos.css('position', 'absolute'); 
441 
 
442             for (i = 0; i < _.count; i++) { 
443 
 
444                 amountLeft = parentWidth * i; 
445                 _.$photos.eq(i).css('left', amountLeft); 
446             } 
447 
 
448 
 
449         } 
450 
 
451         Skippr.prototype.keyPress = function() { 
452 
 
453             var _ = this; 
454 
 
455             if(_.settings.keyboardOnAlways == true) { 
456 
 
457                 $(document).on('keydown', function(e) { 
458                     if(e.which == 39) { 
459                          _.$element.find(".skippr-next").trigger('click'); 
460                     } 
461                     if(e.which == 37) { 
462                          _.$element.find(".skippr-previous").trigger('click'); 
463                     } 
464 
 
465                 }); 
466             } 
467 
 
468             if (_.settings.keyboardOnAlways == false) { 
469 
 
470                 _.$parent.hover(function(){ 
471 
 
472                     $(document).on('keydown', function(e) { 
473                         if(e.which == 39) { 
474                              _.$element.find(".skippr-next").trigger('click'); 
475                         } 
476                         if(e.which == 37) { 
477                              _.$element.find(".skippr-previous").trigger('click'); 
478                         } 
479 
 
480                     }); 
481                      
482                 }, function(){ 
483                     $(document).off('keydown'); 
484                 }); 
485             } 
486              
487         } 
488 
 
489         Skippr.prototype.hidePrevious = function() { 
490 
 
491             var _ = this; 
492 
 
493             if ( _.$element.find(".skippr-nav-element").eq(0).hasClass('skippr-nav-element-active')) { 
494                  _.$element.find(".skippr-previous").fadeOut(); 
495             } else { 
496                  _.$element.find(".skippr-previous").fadeIn(); 
497             } 
498         } 
499 
 
500         Skippr.prototype.logs = function(message) { 
501 
 
502             var _ = this; 
503 
 
504             _.settings.logs === true && console.log(message); 
505 
 
506         } 
507 
 
508 
 
509 
 
510         return Skippr; 
511 
 
512     })(); 
513 
 
514     $.fn.skippr = function (options) { 
515 
 
516         var instance; 
517 
 
518         instance = this.data('skippr'); 
519         if (!instance) { 
520             return this.each(function () { 
521                 return $(this).data('skippr', new Skippr(this,options)); 
522             }); 
523         } 
524         if (options === true) return instance; 
525         if ($.type(options) === 'string') instance[options](); 
526         return this; 
527     }; 
528 
 
529     $.fn.skippr.defaults = { 
530         transition: 'slide', 
531         speed: 1000, 
532         easing: 'easeOutQuart', 
533         navType: 'block', 
534         childrenElementType : 'div', 
535         arrows: true, 
536         autoPlay: false, 
537         autoPlayDuration: 5000, 
538         keyboardOnAlways: true, 
539         hidePrevious: false, 
540         imgArray : null, 
541         logs: false 
542         
543     }; 
544 
 
545 }).call(this); 
546 
 
547 /*! 
548 * Velocity.js: Accelerated JavaScript animation. 
549 * @version 0.11.2 
550 * @docs http://VelocityJS.org 
551 * @license Copyright 2014 Julian Shapiro. MIT License: http://en.wikipedia.org/wiki/MIT_License 
552 */ 
553 
!function(e){"function"==typeof define&&define.amd?window.Velocity?define(e):define(["jquery"],e):e("object"==typeof exports?window.Velocity?void 0:require("jquery"):window.jQuery
