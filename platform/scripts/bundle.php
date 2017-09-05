<?php

/**
 * Use this script to generate application models.
 */

$FROM_APP = defined('RUNNING_FROM_APP'); //Are we running from app or framework?
include dirname(__FILE__).DS.'Q.inc.php';

#Arguments
$argv = $_SERVER['argv'];
$count = count($argv);

#Usage strings
$usage = "Usage: php {$argv[0]} <pathToBundleDir>\n";

$help = <<<EOT
Script to bundle the app code in a native application bundle.

$usage

EOT;

$app = Q::app();

#Is it a call for help?
if (isset($argv[1]) and in_array($argv[1], array('--help', '/?', '-h', '-?', '/h')))
	die($help);

#Check primary arguments count: 1 if running /app/scripts/Q/combine.php
if ($count < 1 or !$FROM_APP)
	die($usage);

$dir = $argv[1];
if (empty($dir)) {
	die($usage);
}
if (!is_dir($dir)) {
	die("Destination directory not found: $dir\n");
}

#First do the platform rsync
$dirs = glob(APP_WEB_DIR.DS.'Q'.DS.'*');
foreach ($dirs as $dir) {
	$basename = basename($dir);
	$subdirs = glob($dir.DS.'*');
	foreach ($subdirs as $src) {
		$subdir = basename($src);
		$destDir = $dir.DS.$subdir;
		$dest = realpath($destDir.DS.$subdir);
		if (!$dest or !file_exists($dest)) {
			mkdir($destDir);
		}
		$dest = $destDir.DS.$subdir;
		if (!is_dir($dest)) {
			if (file_exists($dest)) {
				unlink($dest);
			}
			mkdir($dest);
			if (!is_dir($dest)) {
				die ("Could not create $dest\n");
			}
		}
		$dest = realpath($dest);
		echo "Syncing $basename/$subdir...\n";
		$exclude = Q_Config::get("Q", "bundle", "exclude", $subdir, array());
		$options = '';
		foreach ($exclude as $e) {
			$excludePath = "$src/$e";
			if (!realpath($excludePath)) {
				echo "\n  (Warning: missing $excludePath)\n";
			}
			$options .= " --exclude=" . escapeshellarg($e);
		}
		exec ("rsync -az --copy-links $options $src/* $dest\n");
	}
}

echo "Syncing $app...\n";
$src = APP_WEB_DIR;
$dest = $dir;
$exclude = Q_Config::get("Q", "bundle", "exclude", $app, array());
$exclude[] = 'plugins';
foreach ($exclude as $e) {
	$excludePath = "$e";
	if (!realpath($src.DS.$excludePath)) {
		echo "\n  (Warning: missing $excludePath)\n";
	}
	$options .= " --exclude=" . escapeshellarg($e);
}
exec ("rsync -az --copy-links $options $src/* $dest\n");