<?php

/** @var \App\Model\Riddle $riddle */
/** @var \App\Service\Router $router */

$title = "{$riddle->getSubject()} ({$riddle->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $riddle->getSubject() ?></h1>
    <article>
        <?= $riddle->getContent();?>
    </article>
    <div>
        Answer: <span id="answerToggle" class="answer hiddenAnswer"><?= $riddle->getAnswer() ?></span>
    </div>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('riddle-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('riddle-edit', ['id'=> $riddle->getId()]) ?>">Edit</a></li>
    </ul>

    <script type="text/javascript">
        document.getElementById('answerToggle').addEventListener('click', (e) => {
            if (e.target.classList.contains('hiddenAnswer')) {
                e.target.classList.remove('hiddenAnswer');
            } else {
                e.target.classList.add('hiddenAnswer');
            }
        });
    </script>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
