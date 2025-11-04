<?php

/** @var \App\Model\Riddle $riddle */
/** @var \App\Service\Router $router */
/** @var ?string $error */

$title = "Edit Riddle {$riddle->getSubject()} ({$riddle->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('riddle-edit') ?>" method="riddle" class="edit-form">
        <div class="error"><?= $error ?></div>
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="riddle-edit">
        <input type="hidden" name="id" value="<?= $riddle->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('riddle-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('riddle-delete') ?>" method="riddle">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="riddle-delete">
                <input type="hidden" name="id" value="<?= $riddle->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
