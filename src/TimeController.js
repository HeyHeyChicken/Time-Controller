/*!
 * Time Controller 1.1.1
 * https://github.com/HeyHeyChicken/Time-Controller
 * @license MIT licensed
 *
 * Copyright (C) 2020 Duval Antoine (HeyHeyChicken)
 */

let time_controllers = [];
let cn_index = "data-time-controllers-index";
$(".time-controller").each(function(y){
    let cursor = $(this).find("> .ruller > .cursor");
    cursor.attr(cn_index, y);
    time_controllers[y] = {
        data : [],
        closest : null
    };
    $(this).find("> .ruller > .line").each(function(x){
        time_controllers[y].data[x] = 0;
    });
});

const CURSOR = $(".time-controller > .ruller > .cursor");
CURSOR.draggable({
    axis: "x",
    containment: "parent",
    drag: function(event, ui) {
        drag(ui.position.left, $(this));
    }
});

function drag(left, cursor, moveCursor = false){
    if(moveCursor === true){
        cursor.css("left", left);
    }
    let ruller = cursor.closest(".ruller");
    let time_controller = ruller.closest(".time-controller");
    let input = time_controller.find("> input");
    let y = parseInt(cursor.attr(cn_index));
    time_controllers[y].closest = null;
    if(ruller.length){
        ruller.find("> .line").each(function(x){
            let distance = Math.abs($(this).position().left - left);
            let circle_size = 24;
            let circle_margin = 30;
            //let translate = 24 - distance * 0.5;
            let translate = 0;
            if(distance <= (circle_size + circle_margin)){
                translate = Math.sin(Math.acos(distance / (circle_size + circle_margin))) * (circle_size + circle_margin);
            }
            translate -= circle_margin;

            if(translate < 0){
                translate = 0;
            }
            if(time_controllers[y].data[x] != translate){
                time_controllers[y].data[x] = translate;
                $(this).css("transform", "translateY("+translate+"px)");

                if(time_controllers[y].closest == null || time_controllers[y].closest.distance > distance){
                    time_controllers[y].closest = {
                        dom : $(this),
                        distance : distance
                    }
                }
            }
        });
    }
    if(time_controllers[y].closest != null){
        let value = time_controllers[y].closest.dom.attr("data-value");
        cursor.html(value);
        input.val(value);
    }
}

drag(24, CURSOR, true);