<html>
<body>
<?php
echo "FILE INPUT:";
echo "<pre>";
print_r($_FILES);
echo "\nGlobal Post:\n";
print_r($_POST);
echo "</pre>";
?>
</body>
<script>
    window.name=document.getElementsByTagName('body')[0].innerHTML;
</script>
</html>