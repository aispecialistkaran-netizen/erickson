<?php
/**
 * Smart Homepage Router for Erickson.co.in
 * Shows index.html for regular visitors, WordPress for admin/Elementor access
 */

// Check if this is a WordPress admin or Elementor request
$is_wp_request = (
    // WordPress admin area
    (isset($_GET['wp-admin']) || strpos($_SERVER['REQUEST_URI'], 'wp-admin') !== false) ||
    
    // Elementor editor or preview
    (isset($_GET['elementor-preview']) || isset($_GET['action']) && $_GET['action'] == 'elementor') ||
    
    // WordPress customizer
    (isset($_GET['customize_theme']) || isset($_GET['wp_customize'])) ||
    
    // WordPress login
    (strpos($_SERVER['REQUEST_URI'], 'wp-login') !== false) ||
    
    // AJAX requests
    (isset($_GET['action']) || (defined('DOING_AJAX') && DOING_AJAX)) ||
    
    // REST API requests
    (strpos($_SERVER['REQUEST_URI'], 'wp-json') !== false) ||
    
    // Admin or logged in user accessing homepage
    (function_exists('is_user_logged_in') && is_user_logged_in() && current_user_can('edit_posts')) ||
    
    // Check for Elementor in referrer or user agent
    (isset($_SERVER['HTTP_REFERER']) && strpos($_SERVER['HTTP_REFERER'], 'elementor') !== false) ||
    (isset($_SERVER['HTTP_USER_AGENT']) && strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'elementor') !== false)
);

// If this is a WordPress/admin request, load WordPress
if ($is_wp_request || !file_exists('index.html')) {
    // Load WordPress
    define('WP_USE_THEMES', true);
    require_once('wp-blog-header.php');
    return;
}

// For regular visitors accessing the homepage, show the custom HTML
if ($_SERVER['REQUEST_URI'] === '/' || $_SERVER['REQUEST_URI'] === '/index.php') {
    // Serve the custom HTML file
    $html_content = file_get_contents('index.html');
    
    if ($html_content !== false) {
        // Set proper headers
        header('Content-Type: text/html; charset=UTF-8');
        header('X-Served-By: Custom-Homepage');
        
        // Output the HTML content
        echo $html_content;
        exit;
    }
}

// Fallback to WordPress for any other requests
define('WP_USE_THEMES', true);
require_once('wp-blog-header.php');
?>