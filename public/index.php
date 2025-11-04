<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;

    case 'riddle-index':
    case null:
        $controller = new \App\Controller\RiddleController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'riddle-create':
        $controller = new \App\Controller\RiddleController();
        $view = $controller->createAction($_REQUEST['riddle'] ?? null, $templating, $router);
        break;
    case 'riddle-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\RiddleController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['riddle'] ?? null, $templating, $router);
        break;
    case 'riddle-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\RiddleController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'riddle-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\RiddleController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;

    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
