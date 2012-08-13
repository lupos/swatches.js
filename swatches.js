// TCP Swatch Control
// Multipurpose product swatch control
// version 1.0 August 10th, 2012
// by Joseph Chagan

// Built with:
// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 1.1, May 14th, 2011
// by Stefan Gabos

// This plugin requires climb.js by Joseph Chagan

(function($) {
    $.swatches = function(element, options) {
        var defaults = {
            swatchName : '.swatch',
            overflow : 'false',
            swatchRevealClasses : '',
            targetName : '.productImage', //can be class or id, requires "." or "#""
            targetLevel : 3 //This is the number of levels above the swatch that the target can be found (.find)
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element), // reference to the jQuery version of DOM element
             element = element;    // reference to the actual DOM element

        //set up all plugin wide variables
        var productRowWidth,
            swatches,
            swatchWidth,
            targetName,
            relatedSwatches,
            relatedSwatchesCount,
            reveal,
            swatchReveal ,
            targetLevel,
            productImages = [],
            relatedImageContainer,
            relatedImage,
            relatedSwatchContainer;
            
        // the "constructor" method that gets called when the object is created

        plugin.init = function() {

            // the plugin's final properties are the merged default and 
            // user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);
            swatches = $(element).find(plugin.settings.swatchName);
            swatchWidth = swatches.eq(0).outerWidth(true);
            productImages = swatches.find('img').map(function(){
                return $(this).attr('swatchLink');
            })
            targetLevel = plugin.settings.targetLevel;
            targetName = plugin.settings.targetName;
            swatchReveal = '<div class="' + plugin.settings.swatchRevealClasses + '"></div>';
            if(plugin.settings.overflow){
                plugin.setSwatchContainers(true);
            }

            /*create storage for current image and set default to 0*/
            $(targetName).each(function(){
                $(this).data('currentSwatch', 0);
            });


            swatches.each(function(){            
                relatedImageContainer = $(this).climb(targetLevel).find(targetName);
                relatedImage = relatedImageContainer.find('img');
                relatedSwatchContainer = $(this).parent();
                $(this).mouseenter(function(){
                    relatedImage.attr("src", "images/tcp/sub-category/" + productImages[$(this).index()] );
                });

                $(this).mouseleave(function(){
                    relatedImage.attr("src", "images/tcp/sub-category/" + productImages[relatedImageContainer.data('currentSwatch')]);
                });

                $(this).click(function(){
                    relatedImage.attr("src", "images/tcp/sub-category/" + productImages[$(this).index()]);
                    relatedImageContainer.data('currentSwatch', $(this).index())
                    removeHighLight($(this));
                    $(this).addClass('selected');
                    if(relatedSwatchContainer.hasClass("open")){
                        relatedSwatchContainer.removeClass("open");
                    };
                });
            });
        }

        plugin.closeSwatchReveal = function(){
            $element.each(function(){
                if($(this).hasClass("open")){
                    $(this).removeClass("open");
                };
            });
        }

        /*attach all mouse behaviors to each swatch*/
        plugin.setSwatchContainers = function(init){
            productRowWidth = $('.productRow.swatchesRow').width();
            $element.each(function(index){
                relatedSwatches = $(this).find('.swatch');
                relatedSwatchesCount = relatedSwatches.length;
                relatedSwatchesCount = relatedSwatchesCount - 1;
                relatedSwatches.last().after(swatchReveal);
                reveal = $(this).find('.swatchReveal');
                $(this).removeClass('overflowed');
                if(!reveal.hasClass('hidden')){
                    reveal.addClass('hidden');
                };
                if((swatchWidth * relatedSwatchesCount) > productRowWidth && reveal.hasClass('hidden')){
                    reveal.removeClass('hidden');
                    $(this).addClass('overflowed');
                };
                if(init){
                    $(this).delegate('.swatchReveal', 'click', function(){
                        $(this).parent().toggleClass('open');
                    });
                }
            });
        };

        var removeHighLight = function(clicked){
            clicked.siblings('div.swatch.block').removeClass('selected');
        }

        plugin.init();

    }

    // add the plugin to the jQuery.fn object
    $.fn.swatches = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('swatches')) {
                var plugin = new $.swatches(this, options);
                $(this).data('swatches', plugin);
            }
        });
    }
})(jQuery);