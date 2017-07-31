;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/activity/bigPan.css');

    var turnTable = require('../../ui/turnTable.js');    
    var sweepPan = new turnTable('#turntable',{
            defaultClass:'turntable-0',
            action:['turntable-1','turntable-2','turntable-3','turntable-4','turntable-5','turntable-6'],
            minTimer:3000
    });

    $('#start_btn').on('click',function(){
        sweepPan.start();
    })

    sweepPan.on('stop',function(){
        alert('stop')
    })

    $('#stop_btn').on('click',function(){
        sweepPan.stop(0);
    })
})
