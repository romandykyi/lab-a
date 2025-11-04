<?php
    /** @var $riddle ?\App\Model\Riddle */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="riddle[subject]" value="<?= $riddle ? $riddle->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="riddle[content]"><?= $riddle? $riddle->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="content">Answer</label>
    <input type="text" id="answer" name="riddle[answer]" value="<?= $riddle ? $riddle->getAnswer() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
