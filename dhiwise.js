 $('.category-flex').click(function(){

 $('.category-flex').removeClass("fltr-active");

         if($(this).hasClass("fltr-active")){

         $(this).removeClass("fltr-active");

     }else{

         $(this).addClass("fltr-active");

     }

     var str = $(this).find( ".text-block-36" ).text();

        $(".category-title").html(str);

 });

 (function() {

     var projectsGrid = new FsLibrary('.screen-list-dynamic')

   

     var myFilters = [

     {

       filterWrapper: ".category-list",

         filterType: "exclusive"

     },

   {

       filterWrapper: ".search-parent",

         filterType: "exclusive"

     },

 ]

  // run filter on our instance

     projectsGrid.filter({

         filterArray: myFilters, // the filter group name we defined

     activeClass: 'fltr-active', // the active class we give to our buttons

     emptyMessage: '.empty-message',

         animation: {

             enable: true,

             duration: 200,

             }

   })

 })();

 

 // INITIAL FIRST TAB OPEN

 $(document).ready(function() {

   var firstDiv = $("#categoryList").find(".w-dyn-item").first();

   var inputOfFirstDiv = firstDiv.find("input[type=radio]")

   var id = inputOfFirstDiv.attr("id");

   document.getElementById(id).click();

  });

 

 function updatePreview(){

     let ss = localStorage.getItem("selectedScreen") || [];

   if(ss && ss.length){

     ss = JSON.parse(ss);

   }

     var s = $("#screenlist").find(".w-dyn-item").first();

      if(s.attr("style").length === 0){

        var o = s.find('#screenConfig');

        var figmaId = o.data('figmaid');

        var screenId = o.data('screenid');

        var id = o.data('image');

        var n = o.data('name');

        var buttonName = "Add screen";

         let figmaObj = ss.find((v)=>{

             return v.figmaId === figmaId;

           });

         let sObj = figmaObj?.screenIds.find((s)=>{

            return s.screenId === screenId

           })

         if(sObj && sObj.screenId === screenId){

           buttonName = "Remove screen";

         }

        updatePreviewData(n,figmaId,screenId,buttonName,id)

        

         }

 }

 

 function updatePreviewData(sname,figmaId,screenId,buttonName,id){

     $("#previewDiv .screen-title").text(sname);

   var c = document.querySelectorAll("#previewDiv .div-block-318")[0];

   var i = document.createElement("input");

   i.type = "hidden";

   i.id = "view-screen-config"

   i.setAttribute("data-figmaid", figmaId);

   i.setAttribute("data-screenid", screenId);

   c.prepend(i);

   $("#previewDiv .add-screen-btn").text(buttonName);

   $("#previewDiv #preview img").attr("src",id);

 }

 

 // view first screen

 $(document).ready(function() {

         setTimeout(()=>{

             updatePreview();

         },500);

  });

 

 function updateOnViewClick(hiddenInput){

   var name = hiddenInput.data('name');

   var f = hiddenInput.data('figmaid');

   var s = hiddenInput.data('screenid');

   var imgs = hiddenInput.data('image');

   let ss = localStorage.getItem("selectedScreen") || [];

   if(ss && ss.length){

     ss = JSON.parse(ss);

   }

   var buttonName = "Add screen";

   let fobj = ss.find((v)=>{

     return v.figmaId === f;

   });

 

   let sObj = fobj?.screenIds.find((so)=>{

       return so.screenId === s;

   })

   if(sObj && sObj.screenId === s){

     buttonName = "Remove screen";

   }

   updatePreviewData(name,f,s,buttonName,imgs);

    

 }

 $("[id=view-btn]").click(function(e){

     //alert("CLICK ON VIEW")

   var hiddenInput = $(this).find("#hiddenScreen");

   updateOnViewClick(hiddenInput);

 })

 

 function incOrDecCountOnCategory(count){

     var category = $("#categoryList").find('.w-dyn-item').children(".fltr-active");

   category.find(".category-count").children('#count').text(count+"/");

 }

 

 function addOrRemoveItem(target,figmaId,screenId,name,img){

     let ss = localStorage.getItem("selectedScreen") || [];

     if(ss && ss.length){

         ss = JSON.parse(ss);

   }

   if(Array.isArray(ss) && ss.length){

   var foundIndex = ss.findIndex(x => x.figmaId === figmaId);

    var figmaObj =    foundIndex >= 0 ? ss[foundIndex] : {};

    if(figmaObj && Object.keys(figmaObj).length){

            if(figmaObj?.screenIds && Array.isArray(figmaObj?.screenIds)){

           let sObj = figmaObj?.screenIds.find((s)=>{

             return s.screenId === screenId;

           })

         if(sObj && sObj.screenId === screenId){

             // remove     

           const index = figmaObj?.screenIds.findIndex(x => x.screenId === screenId);

           if (index > -1) {

             figmaObj?.screenIds.splice(index, 1);

             $(target).removeClass('remove-screen');

             incOrDecCountOnCategory(figmaObj?.screenIds.length);

           }

               ss[foundIndex] = figmaObj?.screenIds.length ? figmaObj : {};

         }else {

             // add

           let ao = { figmaId,screenId,name,img };

           figmaObj?.screenIds.push(ao);

               ss[foundIndex] = figmaObj;

           $(target).addClass('remove-screen');

           incOrDecCountOnCategory(figmaObj?.screenIds.length);

         }

       }

    }else{

        // add figma id

     let obj = {

         figmaId:figmaId,

       screenIds:[{screenId,figmaId,name,img}]

     }

     ss.push(obj);

     $(target).addClass('remove-screen');

     incOrDecCountOnCategory(obj.screenIds.length);

    }   

    localStorage.setItem("selectedScreen",JSON.stringify(ss));

    var pf =  $("#view-screen-config").data('figmaid');

    var ps = $("#view-screen-config").data('screenid');

     if(figmaId === pf && screenId === ps){

       var h = $(target).siblings("#view-btn").find("#hiddenScreen");

       updateOnViewClick(h);

     }

     updateTotalCountOnButton();

     updateScreenPageCount();

   }

 }

 

 // ADD OR REMOVE SCREEN FUNCTIONALITY HERE

 $(".add-screen").click(function(e){

   var h = $(this).find("#screenConfig");

   var f = h.data('figmaid');

   var s = h.data('screenid');

   var i = h.data('image');

   var n = h.data('name');

   addOrRemoveItem(this,f,s,n,i);

 });

 

 // UPDATE TOTAL SCREEN COUNT IN BUTTON

  function updateTotalCountOnButton(){

      let ss = localStorage.getItem("selectedScreen");

     if(ss && ss.length){

         ss = JSON.parse(ss);

          let totalCount = ss.reduce((total,obj)=> {

         return total + obj.screenIds?obj.screenIds.length:0;

       },0);

       document.getElementById("selectedScreenCount").innerHTML = totalCount;

     }

  }

     $(window).load(function() {

     setTimeout(()=>{

       updateTotalCountOnButton();

     },1000)

   })

 

 function updateScreenPageCount(){

   var cnt = $("#categoryList .w-dyn-item .fltr-active")

   $("#screen-page-count").text(cnt.find("#count").text()+cnt.find(".text-block-37").text()+" screens selected")

 }

 

 $("#categoryList .w-dyn-item").click(function(){

     $("#screen-page-count").text($(this).find("#count").text()+$(this).find(".text-block-37").text()+" screens selected")

 })

 

 // UPDATE APP CATEGORY'S SCREEN SELECTED COUNT

 $(document).ready(function(){

     setTimeout(()=>{

       let ss = localStorage.getItem("selectedScreen") || [];

     if(ss && ss.length){

         ss = JSON.parse(ss);

     }

       $( ".selected-count" ).each(function() {

       let fid = $( this ).data("figmaid");

       let fObj = ss.find((e)=>{

         return e.figmaId === fid;

       })

       if(fObj && Object.keys(fObj).length){

         let c =  fObj?.screenIds.length;

         $(this).parent().siblings().closest("#count").text(c+"/");

       }

       });

     

     updateScreenPageCount();

     

     //DEFAULT IF SELECTED THEN REMOVE BUTTON ELSE ADD

     $( "[id=screenConfig]" ).each(function() {

          let fobj = ss.find((v)=>{

         return v.figmaId === $(this).data("figmaid");

     });

     let sObj = fobj?.screenIds.find((so)=>{

             return so.screenId === $(this).data("screenid");

     })

     if(sObj && sObj.screenId === $(this).data("screenid")){

       $(this).closest('.add-screen').addClass('remove-screen');

     }

   });

   },1000)

 })

 

 $(".remove-all-btn").click(function(){

     var c = $("#categoryList").find('.w-dyn-item').children(".fltr-active");

      var fid = c.find(".selected-count").data('figmaid');

   let ss = localStorage.getItem("selectedScreen") || [];

     if(ss && ss.length){

         ss = JSON.parse(ss);

       var fi = ss.findIndex(v => v.figmaId === fid);

       if(fi>=0){

           ss[fi] = {};

         localStorage.setItem("selectedScreen",JSON.stringify(ss));

         updateTotalCountOnButton();

         incOrDecCountOnCategory(0);

         updateScreenPageCount();

         $("#previewDiv").find(".add-screen-btn").text("Add screen")

         $(".add-screen").removeClass('remove-screen')

       }

     }      

 })

 

 $("#previewDiv .add-screen-btn").click(function(e){

     var f = $('#view-screen-config').data('figmaid');

     var s = $('#view-screen-config').data('screenid');

     var target;

     var n = "";

     var i = "";

     $(".add-screen").each(function(v){

     var sd = $(this).find("#screenConfig");

     var fi = sd.data('figmaid');

     var si = sd.data('screenid');

       if(fi === f && si === s){

           i = sd.data('image');

             n = sd.data('name');

         target = this;

       }

     })

     target && addOrRemoveItem(target,f,s,n,i);

     });

   

   $("#ss-btn").click(function(){

       let listHTML = ''; 

     for(var i=0; i < selectedScreen.length; i++){

       let fObj = selectedScreen[i];

       if(fObj && Object.keys(fObj).length && fObj.screenIds){

         for(var j=0; j<fObj.screenIds.length; j++){

           let sObj = fObj.screenIds[j];

           // concat html here 

           listHTML += `<div role="listitem" class="cart-item w-dyn-item">

         <div class="div-block-322">

             <div class="delete-card screen-card screen-list-card">

                 <div class="screeb-card-overlay"></div>

                 <img src="${sObj.img}" alt="" class="w-commerce-commercecartitemimage image-94" />

                 <div class="template-details">

                     <div class="div-block-324">

                         <div class="remove-screen-circle">

                             <img src="https://global-uploads.webflow.com/618e36726d3c0f19c9284e56/6221a42387fdd86f797946cb_trash.svg" loading="lazy" alt="" class="delete-icon" />

                             <div class="text-block-30">Remove</div>

                             <div class="w-embed">

                                 <input

                                     type="hidden"

                                     id="ssremove"

                                     data-name="${sObj.name}"

                                     data-image="${sObj.img}"

                                     data-screenid="${sObj.screenId}"

                                     data-figmaid="${sObj.figmaId}"

                                 />

                             </div>

                         </div>

                         <a id="ssView-btn" href="#" class="rounded-btn code-view code-btn code-btn-action w-inline-block">

                             <img src="https://global-uploads.webflow.com/618e36726d3c0f19c9284e56/62d3b4286105de9c38363a30_white-eye.svg" loading="lazy" alt="" class="image-97" />

                             <div class="w-embed">

                                 <input

                                     type="hidden"

                                     id="ssview"

                                     data-name="${sObj.name}"

                                     data-image="${sObj.img}"

                                     data-screenid="${sObj.screenId}"

                                     data-figmaid="${sObj.figmaId}"

                                 />

                             </div>

                         </a>

                     </div>

                 </div>

             </div>

             <div id="ss-name" class="w-commerce-commercecartproductname text-block-29">${sObj.name}</div>

         </div>

         </div>`;

         }

       }

     }

     document.querySelectorAll("#ss-list .w-dyn-items")[0].innerHTML = listHTML;

   })
