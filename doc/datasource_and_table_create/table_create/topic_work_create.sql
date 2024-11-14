create table topic_work (
    topic_id varchar(255),
    work_id varchar(255),
    PRIMARY KEY (topic_id, work_id),
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id)
    FOREIGN KEY (work_id) REFERENCES work(work_id),
);
