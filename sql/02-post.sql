create table riddle
(
    id integer not null
       constraint riddle_pk
       primary key autoincrement,
    subject text not null,
    content text not null,
    answer text not null
);
