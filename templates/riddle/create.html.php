<?php

/** @var \App\Model\Riddle $riddle */
/** @var \App\Service\Router $router */
/** @var ?string $error */

$title = 'Create Riddle';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Riddle</h1>
    <form action="<?= $router->generatePath('riddle-create') ?>" method="riddle" class="edit-form">
        <div class="error"><?= $error ?></div>
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="riddle-create">
    </form>

    <a href="<?= $router->generatePath('riddle-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
