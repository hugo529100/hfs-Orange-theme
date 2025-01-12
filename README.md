
sorry for my broken english ：

here is my personal theme modify ,share to our hfs3 friends , some logo or my workshop nane inside just remove or change that if you wish is free and no copyright at all. (i just made and use in local router pack to apps for fun )

i been mod alot thing inside for vi ,just share and dont waste it ~ha ha

if pack too big just delete the images then or replace other smaller sample image .

other things just for refrence and replace , fit for the theme vi .
i mode it just fit for cellphone and computer .
additonal custom html spr&css just list in the README.md inside .

thanks rejetto again for build that great project
![401752330-180a37bc-9b0b-4707-bc63-8cccc4ef80d3](https://github.com/user-attachments/assets/2214a255-b48f-4012-9907-645863c81c8d)
![401752357-6262864e-0d60-4208-a1c6-d9deeb7eb1db](https://github.com/user-attachments/assets/f7135a50-ea94-4a34-86bb-2cea23a017f8)
![401752376-2cd92be6-3400-4322-8a0e-1021daa82397](https://github.com/user-attachments/assets/19ae7dd5-b604-430c-883c-55b3e904386a)
![401752361-667ab289-051a-49ac-a42b-f52c88697044](https://github.com/user-attachments/assets/baf6901c-6233-4846-8a53-aaed69cf7e6e)
![401752367-f11ed76b-e555-48e3-bb7f-671f60ae9854](https://github.com/user-attachments/assets/6c4e09e5-a314-4827-b759-7e8bc9a214c9)
![401752370-0bf17ddd-19e3-4b2d-bd69-98ef20ea7383](https://github.com/user-attachments/assets/71a05c15-c854-46bc-b274-3524f6f64886)

======================================================================
keep going upadte with my daily using
2025/01/12 a bit more fix, just like the little pages tab when files up above 1000 or more , web page load on cell phone ,the buttom tabs would warp over left side ,then just fix out.  thumbnails and icons improve size ,files names fix....

======================================================================


custom htmls need (include readme.md)


=================style=====================


/*禁用主页按钮*/
/* .breadcrumb:nth-of-type(2) { display: none } */


<style type="text/css">
       
   html {
    zoom: 1.0;
  }
 </style>


=================before header=====================

<!-- banner范围限制 -->
<style> 
#banner img{
  top:5 px;
  height:100%;
  height:180px;
  width: 100%;
  position: relative;
  object-fit: cover;
  object-position: center;
   }
</style>

 
<!-- 原版固定图片
<div id="banner">
<img src="/images/13.png"></img>
</div>
 -->

<!-- banner随机图片限制 -->
<style>
#randomImage {
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
  top:5 px;
  height:100%;
  height:180px;
  width: 100%;
  position: relative;
  object-fit: cover;
  object-position: center;
    }
</style>

<!-- banner随机图片路径 -->
<div id="banner">
<img id="randomImage" src="" alt="Random Image">
    <script>
        var images = [
            '/images/18.jpg',
            '/images/19.jpg',
            '/images/20.jpg',
            '/images/21.jpg',
            '/images/22.jpg'
            
        ];
    </script>
</div>


<!-- banner随机图片脚本 -->
<script>
    var imgElement = document.getElementById('randomImage');
    function setRandomImage() {
        var randomIndex = Math.floor(Math.random() * images.length);
        imgElement.src = images[randomIndex];
        imgElement.style.opacity = 1;
    }
    imgElement.onload = function() {
        imgElement.style.opacity = 1;
    }
    imgElement.style.opacity = 0;
    setRandomImage();
</script>


<!-- 每次刷新触发随机图 -->
<script>
    window.onload = function() {
        document.getElementById('randomImage').src = getRandomImage();
    }
</script>

=================after header=====================
<style>
.list-wrapper { max-width: 70em;margin-right: auto;margin-left: auto;}
</style>

=================footer=====================
<style> 
.footer-w3l p {
    font-size: 10px;
    position: relative;
    height: 4px;
    object-position: center;
    text-align:center;
    max-width: 93em;
    margin-right: auto;
    margin-left: auto;
}
</style>

<style> 
.footer-w3l a {
    font-size: 8px;
}
</style>

<div class="footer-w3l">
	<p>｛紫雲古琴斵製技藝坊｝<a ="_blank" href="https://luthier.blog/">THE GUQIN LUTHIERY & WORKSHOP. SINCE 2014. </a></p>
		<p>Copyright &copy; 2024. ZIYUN GUQIN LUTHIERY. All rights reserved.</p>
</div>
