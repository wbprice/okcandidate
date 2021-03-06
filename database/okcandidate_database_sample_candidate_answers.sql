﻿insert into candidate_answer (answer_id, candidate_id)
select answer_id, candidate_id from (
select question_id, min(id) as answer_id, 1 as candidate_id
from answer
group by question_id
order by question_id) t0;

insert into candidate_answer (answer_id, candidate_id)
select answer_id, candidate_id from (
select a.question_id, min(a.id) as answer_id, 2 as candidate_id
from answer a
left join candidate_answer ca
on a.id = ca.answer_id
where ca.answer_id is null
group by question_id
order by question_id) t0;

insert into candidate_answer (answer_id, candidate_id)
select answer_id, candidate_id from (
select a.question_id, min(a.id) as answer_id, 3 as candidate_id
from answer a
left join candidate_answer ca
on a.id = ca.answer_id
where ca.answer_id is null
group by question_id
order by question_id) t0;
