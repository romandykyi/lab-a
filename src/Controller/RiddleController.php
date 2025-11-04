<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Riddle;
use App\Service\Router;
use App\Service\Templating;

class RiddleController
{
    private function isNullOrEmptyString(?string $str){
        return $str === null || trim($str) === '';
    }

    private function validateRiddle(Riddle $riddle) : ?string
    {
        if ($this->isNullOrEmptyString($riddle->getSubject()))
        {
            return "Subject is required";
        }
        if ($this->isNullOrEmptyString($riddle->getAnswer()))
        {
            return "Answer is required";
        }
        return null;
    }

    public function indexAction(Templating $templating, Router $router): ?string
    {
        $riddles = Riddle::findAll();
        $html = $templating->render('riddle/index.html.php', [
            'riddles' => $riddles,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestRiddle, Templating $templating, Router $router): ?string
    {
        $error = null;
        if ($requestRiddle) {
            $riddle = Riddle::fromArray($requestRiddle);

            $error = $this->validateRiddle($riddle);

            if ($error === null) {
                $riddle->save();

                $path = $router->generatePath('riddle-index');
                $router->redirect($path);
                return null;
            }
        } else {
            $riddle = new Riddle();
        }

        $html = $templating->render('riddle/create.html.php', [
            'riddle' => $riddle,
            'router' => $router,
            'error' => $error
        ]);
        return $html;
    }

    public function editAction(int $riddleId, ?array $requestRiddle, Templating $templating, Router $router): ?string
    {
        $riddle = Riddle::find($riddleId);
        if (! $riddle) {
            throw new NotFoundException("Missing riddle with id $riddleId");
        }

        $error = null;
        if ($requestRiddle) {
            $riddle->fill($requestRiddle);

            $error = $this->validateRiddle($riddle);
            if ($error === null) {
                $riddle->save();

                $path = $router->generatePath('riddle-index');
                $router->redirect($path);
                return null;
            }
        }

        $html = $templating->render('riddle/edit.html.php', [
            'riddle' => $riddle,
            'router' => $router,
            'error' => $error
        ]);
        return $html;
    }

    public function showAction(int $riddleId, Templating $templating, Router $router): ?string
    {
        $riddle = Riddle::find($riddleId);
        if (! $riddle) {
            throw new NotFoundException("Missing riddle with id $riddleId");
        }

        $html = $templating->render('riddle/show.html.php', [
            'riddle' => $riddle,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $riddleId, Router $router): ?string
    {
        $riddle = Riddle::find($riddleId);
        if (! $riddle) {
            throw new NotFoundException("Missing riddle with id $riddleId");
        }

        $riddle->delete();
        $path = $router->generatePath('riddle-index');
        $router->redirect($path);
        return null;
    }
}
