<?php
echo "FILE INPUT:";
echo "<pre>";
print_r($_FILES);
echo "\nGlobal Post:\n";
print_r($_POST);
echo "</pre>";
/*
if($_REQUEST['XDM']){	//A cross domain implimentation Using name transport
?>
<script>
if(window.self==window.top){		//Check if the request is from iframe or direct access
	//alert("we are not in frame")
	//Nothing to do
}else{ //Use name transport to pass message
	window.name=document.documentElement.innerHTML;
}
</script>
<?php  } 
*/