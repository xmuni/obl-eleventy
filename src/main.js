'use strict';

// https://stackoverflow.com/questions/51236332/event-delegation-with-vanilla-js

onload = main;

var big_img = document.querySelector("#photo-viewer #big-image img");
var big_caption = document.querySelector("#caption");

var lightbox = null;

var img_srcs = []; // Array of src attributes of all images in gallery
var thumbnail_links = [];


function main()
{
    // console.log("Main ok");
    thumbnail_links = document.querySelectorAll(".category a");

    thumbnail_links.forEach(element => {
        element.addEventListener('mouseover', () => {

            var url = element["href"];
            if(url.includes("_h"))
                url = url.replace("_h","_m");

            big_img.src = url;

            var caption = element.attributes['data-caption'].value;
            big_caption.textContent = caption;
        });
    });


    var images = document.querySelectorAll(".category a img");
    images.forEach(img => {
        img_srcs.push(img.getAttribute("src"));
    });

    return;


    // Set up lightbox

    lightbox = new Lightbox();
    lightbox.Enable(false);

    var imglinks = document.querySelectorAll(".category a");
    // console.log(imglinks);
    imglinks.forEach(a => {
        a.addEventListener("click", (e) => {
            if(window.innerWidth > 900)
            {
                e.preventDefault();
                console.log(e.target);

                var src = e.target.getAttribute("src");
                lightbox.SetImgSrc(src);

                // lightbox.img.setAttribute("src",src.replace("_s","_h"));
                // lightbox.Enable(true);
            }
        });
    });
}

class Lightbox
{
    constructor()
    {
        this.maindiv = document.createElement("div");
        this.maindiv.id = "lightbox";
        document.querySelector("body").appendChild(this.maindiv);

        this.contentdiv = document.createElement("div");
        this.contentdiv.id = "lightbox-content";
        this.maindiv.appendChild(this.contentdiv);
        this.maindiv.addEventListener("click", (e) => e.target.classList.remove("show"));

        this.closebutton = document.createElement("div");
        this.closebutton.id = "lightbox-close";
        this.closebutton.innerHTML = "&times;";
        this.maindiv.appendChild(this.closebutton);
        this.closebutton.addEventListener("click", () => lightbox.maindiv.classList.remove("show"));

        this.caption = document.createElement("div");
        this.caption.id = "lightbox-caption";
        this.maindiv.appendChild(this.caption);
        
        this.imgcontainer = document.createElement("div");
        this.imgcontainer.id = "lightbox-img-container";
        this.contentdiv.appendChild(this.imgcontainer);

        this.img = document.createElement("img");
        this.img.setAttribute("src","img/default.jpg");
        this.imgcontainer.appendChild(this.img);
        
        this.thumbnailsdiv = document.createElement("div");
        this.thumbnailsdiv.id = "lightbox-thumbnails";
        this.contentdiv.appendChild(this.thumbnailsdiv);
        this.contentdiv.addEventListener("click", (e) => {
            if(e.target === lightbox.contentdiv)
                lightbox.maindiv.classList.remove("show");
        });

        // var urls = []

        this.thumbnails = [];
        for(var i=0; i<9; i++)
        {
            var thumb = document.createElement("img");
            thumb.setAttribute("src","img/default.jpg");
            this.thumbnails.push(thumb);
            this.thumbnailsdiv.appendChild(thumb);
            thumb.addEventListener("click", (e) => {
                lightbox.SetImgSrc(e.target.getAttribute("src"));
            });
        }

        document.addEventListener("keydown", (e) => {
            if(e.code == "Escape")
                lightbox.Enable(false);
            else if(e.code == "ArrowRight")
                lightbox.Next();
            else if(e.code == "ArrowLeft")
                lightbox.Prev();
        });
    }

    Enable(enabled)
    {
        if(enabled)
            this.maindiv.classList.add("show");
        else
            this.maindiv.classList.remove("show");
    }

    SetImgSrc(src_small)
    {
        if(!src_small)
            return;

        // console.log("Showing src (small):",src_small);
        // console.log(this);
        
        this.Enable(true);
        this.img.setAttribute("src",src_small.replace("_s","_h"));


        // Update lightbox thumbnails

        var current_src_index = img_srcs.indexOf(src_small);
        // console.log("current_src_index",current_src_index);
        
        if(current_src_index<0)
            return;

        var thumbcount = this.thumbnails.length;
        var offset = Math.floor((thumbcount-1)/2);
        var selected_thumbnail = offset;
        
        var index_start = current_src_index-offset;
        // console.log("Index start (before):",index_start);

        if(index_start < 0)
        {
            index_start = 0;
            selected_thumbnail = current_src_index;
            // console.log(index_start,offset)
        }
        else if(index_start > img_srcs.length-thumbcount)
        {
            index_start = img_srcs.length-thumbcount;
            selected_thumbnail = thumbcount - (img_srcs.length - current_src_index);
        }

        // console.log("Index start (after):",index_start);

        var selected_srcs = img_srcs.slice(index_start,index_start+thumbcount);

        // console.log(`Selecting srcs from ${index_start} to ${index_end}`);
        // console.log("Selected srcs:",selected_srcs);

        // Set thumbnails src
        for(var i=0; i<thumbcount; i++)
            this.thumbnails[i].setAttribute("src", selected_srcs[i]);

        // Highlight the middle thumbnail
        for(var i=0; i<this.thumbnails.length; i++)
        {
            if(i == selected_thumbnail)
                this.thumbnails[i].classList.add("selected");
            else
                this.thumbnails[i].classList.remove("selected");
        }

        // Set caption
        var caption = thumbnail_links[current_src_index].getAttribute("data-caption");
        if(caption != "")
            caption = "Fotografia "+caption;
            
        this.caption.textContent = caption;
    }

    Prev()
    {
        lightbox.Next(-1);
    }

    Next(shift=1)
    {
        // console.log("Next img",shift,lightbox.img,lightbox.img.getAttribute("src"));
        var src = lightbox.img.getAttribute("src").replace("_h","_s");
        var current_index = img_srcs.indexOf(src);

        if(current_index<0)
            return;

        var new_src = img_srcs[current_index+shift];
        lightbox.SetImgSrc(new_src);
    }

}