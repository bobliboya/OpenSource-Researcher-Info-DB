create table work_author (
    work_id varchar(255),
    author_id varchar(255),
    PRIMARY KEY (work_id, author_id),
    FOREIGN KEY (work_id) REFERENCES work(work_id)
    FOREIGN KEY (author_id) REFERENCES author(author_id),
);