<?php

/** @var \App\Model\Riddle[] $riddles */
/** @var \App\Service\Router $router */

$title = 'Riddle List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Riddles List</h1>

    <a href="<?= $router->generatePath('riddle-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($riddles as $riddle): ?>
            <li><h3><?= $riddle->getSubject() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('riddle-show', ['id' => $riddle->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('riddle-edit', ['id' => $riddle->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
