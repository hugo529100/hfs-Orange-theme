custom htmls


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
