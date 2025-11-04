<?php
namespace App\Model;

use App\Service\Config;

class Riddle
{
    private ?int $id = null;
    private ?string $subject = null;
    private ?string $content = null;

    private ?string $answer = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Riddle
    {
        $this->id = $id;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(?string $subject): Riddle
    {
        $this->subject = $subject;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): Riddle
    {
        $this->content = $content;

        return $this;
    }

    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(?string $answer): Riddle
    {
        $this->answer = $answer;

        return $this;
    }

    public static function fromArray($array): Riddle
    {
        $post = new self();
        $post->fill($array);

        return $post;
    }

    public function fill($array): Riddle
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['subject'])) {
            $this->setSubject($array['subject']);
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }
        if (isset($array['answer'])) {
            $this->setAnswer($array['answer']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM riddle';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $riddles = [];
        $riddlesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($riddlesArray as $riddleArray) {
            $riddles[] = self::fromArray($riddleArray);
        }

        return $riddles;
    }

    public static function find($id): ?Riddle
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM riddle WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $riddleArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $riddleArray) {
            return null;
        }
        $riddle = Riddle::fromArray($riddleArray);

        return $riddle;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO riddle (subject, content, answer) VALUES (:subject, :content, :answer)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'subject' => $this->getSubject(),
                'content' => $this->getContent(),
                'answer' => $this->getAnswer()
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE riddle SET subject = :subject, content = :content, answer = :answer WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':subject' => $this->getSubject(),
                ':content' => $this->getContent(),
                ':answer' => $this->getAnswer(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM riddle WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setSubject(null);
        $this->setContent(null);
    }
}
