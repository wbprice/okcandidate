module.exports = function (server) {
  const Candidate = server.plugins['hapi-shelf'].model('Candidate')
  const SurveyAnswer = server.plugins['hapi-shelf'].model('SurveyAnswer')

  function getCategoryAnswers(surveyResponseId, callback)
  {
    SurveyAnswer
    .query(function(answer_builder) {
      answer_builder.column('candidate_answer.candidate_id')
      answer_builder.column('question.category_id')
      answer_builder.column('question.id as question_id')
      answer_builder.column('question.question_text')
      answer_builder.column('a2.id as candidate_answer_id')
      answer_builder.column('a2.answer_label as candidate_answer_label')
      answer_builder.column('a1.id as voter_answer_id')
      answer_builder.column('a1.answer_label as voter_answer_text')
      answer_builder.innerJoin('answer as a1', 'survey_answer.answer_id', 'a1.id')
      answer_builder.innerJoin('question', 'survey_answer.question_id', 'question.id')
      answer_builder.innerJoin('answer as a2', 'question.id', 'a2.question_id')
      answer_builder.innerJoin('candidate_answer', 'a2.id', 'candidate_answer.answer_id')
      answer_builder.where('survey_answer.survey_response_id', surveyResponseId)
    })
    .fetchAll()
    .then(answers => {
      callback(answers)
    })
  }

  function getCategoryScores(surveyResponseId, callback)
  {
    var score_raw = 'round((sum(cast(survey_answer.intensity as numeric(3,2)))) / cat_scores.score * 100) as category_score'

    SurveyAnswer
    .query(function(cat_builder) {
      cat_builder.column('candidate_answer.candidate_id')
      cat_builder.column('category.id as category_id')
      cat_builder.column('category.category_name')
      cat_builder.column(server.plugins['hapi-shelf'].knex.raw(score_raw))
      cat_builder.innerJoin('question', 'survey_answer.question_id', 'question.id')
      cat_builder.innerJoin('category', 'question.category_id', 'category.id')
      cat_builder.innerJoin('survey_response', 'survey_answer.survey_response_id', 'survey_response.id')
      cat_builder.innerJoin('candidate_answer', 'survey_answer.answer_id', 'candidate_answer.answer_id')
      cat_builder.innerJoin('candidate_geography', function() {
        this.on('candidate_answer.candidate_id', '=', 'candidate_geography.candidate_id')
        .andOn('candidate_geography.geography_id', '=', 'survey_response.geography_id')
      })
      cat_builder.innerJoin('candidate', 'candidate_answer.candidate_id', 'candidate.id')
      cat_builder.join(server.plugins['hapi-shelf'].knex.raw(" \
      (select question.category_id, category.category_name, sum(sa.intensity) as score \
       from survey_answer sa \
       inner join question on sa.question_id = question.id \
       inner join category on question.category_id = category.id \
       where sa.survey_response_id = " + surveyResponseId + " \
       group by question.category_id, category.category_name) as cat_scores on category.id = cat_scores.category_id"))
      cat_builder.where('survey_response.id', surveyResponseId)
      cat_builder.groupBy('candidate_answer.candidate_id', 'category.id', 'category.category_name', 'cat_scores.score')
    })
    .fetchAll()
    .then(categories => {
      callback(categories)
    })
  }

  function formatCandidateMatch(matchArray, categoryArray, answerArray) {
    var output = {}
    output.id = matchArray[0].attributes.surveyId
    output.geographyId = matchArray[0].attributes.geographyId

    output.survey = []

    matchArray.map(function(match) {
      var typeIndex = output.survey.findIndex(type =>
        type.candidateTypeName === match.attributes.typeName)

      var catIndex = -1
      var answerIndex = -1

      if(typeIndex === -1)
      {
        typeIndex = output.survey.push({
          candidateTypeId: match.attributes.typeId,
          candidateTypeName: match.attributes.typeName,
          candidates: [{
            candidateId: match.attributes.candidateId,
            candidateName: match.attributes.candidateName,
            compositeMatchScore: match.attributes.compositeScore,
            categoryMatchScores: []
          }]
        })-1

        categoryArray.map(function(category) {
          if (match.attributes.candidateId === category.attributes.candidateId)
          {
            catIndex = output.survey[typeIndex].candidates[0].categoryMatchScores.findIndex(candCat =>
            candCat.categoryId === category.attributes.categoryId)

            if (catIndex === -1)
            {
              catIndex = output.survey[typeIndex].candidates[0].categoryMatchScores.push({
                categoryId: category.attributes.categoryId,
                categoryName: category.attributes.categoryName,
                categoryMatch: category.attributes.categoryScore,
                questions: []
              })-1
            }

            answerArray.map(function(answer) {
              if(match.attributes.candidateId === answer.attributes.candidateId
              && category.attributes.categoryId === answer.attributes.categoryId)
              {
                output.survey[typeIndex].candidates[0].categoryMatchScores[catIndex].questions.push({
                  questionId: answer.attributes.questionId,
                  questionText: answer.attributes.questionText,
                  candidateAnswerId: answer.attributes.candidateAnswerId,
                  candidateAnswerLabel: answer.attributes.candidateAnswerLabel,
                  voterAnswerId: answer.attributes.voterAnswerId,
                  voterAnswerText: answer.attributes.voterAnswerText
                })
              }
            })
          }
        })
      } else {
        var candIndex = output.survey[typeIndex].candidates.findIndex(cand =>
          cand.candidateId === match.attributes.candidateId)

        if (candIndex === -1)
        {
          candIndex = output.survey[typeIndex].candidates.push({
            candidateId: match.attributes.candidateId,
            candidateName: match.attributes.candidateName,
            compositeMatchScore: match.attributes.compositeScore,
            categoryMatchScores: []
          })-1

          categoryArray.map(function(category) {
            if (match.attributes.candidateId === category.attributes.candidateId)
            {
              catIndex = output.survey[typeIndex].candidates[candIndex].categoryMatchScores.findIndex(candCat =>
              candCat.categoryId === category.attributes.categoryId)

              if (catIndex === -1)
              {
                catIndex = output.survey[typeIndex].candidates[candIndex].categoryMatchScores.push({
                  categoryId: category.attributes.categoryId,
                  categoryName: category.attributes.categoryName,
                  categoryMatch: category.attributes.categoryScore,
                  questions: []
                })-1
              }

              answerArray.map(function(answer) {
                if(match.attributes.candidateId === answer.attributes.candidateId
                && category.attributes.categoryId === answer.attributes.categoryId)
                {
                  output.survey[typeIndex].candidates[candIndex].categoryMatchScores[catIndex].questions.push({
                    questionId: answer.attributes.questionId,
                    questionText: answer.attributes.questionText,
                    candidateAnswerId: answer.attributes.candidateAnswerId,
                    candidateAnswerLabel: answer.attributes.candidateAnswerLabel,
                    voterAnswerId: answer.attributes.voterAnswerId,
                    voterAnswerText: answer.attributes.voterAnswerText
                  })
                }
              })
            }
          })
        }
      }
    })

    return(output)
  }

  return [{
    method: 'GET',
    path: '/api/candidate',
    handler: (request, reply) => {
      Candidate
        .fetchAll()
        .then(candidates => {
          reply(candidates)
        })
    }
  },
  {
    method: 'GET',
    path: '/api/candidate/{id}',
    handler: (request, reply) => {
      Candidate
        .where({id: request.params.id})
        .fetch()
        .then(candidate => {
          reply(candidate)
        })
    }
  },
  {
    method: 'GET',
    path: '/api/candidate_match/{survey_response_id}',
    handler: (request, reply) => {
      SurveyAnswer
      .query(function(score_builder) {
        score_builder.sum('intensity as score');
        score_builder.where('survey_response_id', request.params.survey_response_id)
      })
      .fetch()
      .then(function(total) {
        var score_raw = 'round((sum(cast(survey_answer.intensity as numeric(3,2))) / '
        + total.attributes.score + ') * 100) as composite_score'

        SurveyAnswer
        .query(function(match_builder) {
          match_builder.column('survey_response.id as survey_id', 'survey_response.geography_id')
          match_builder.column('candidate_answer.candidate_id', 'candidate.candidate_name')
          match_builder.column('candidate_type.id as type_id', 'candidate_type.type_name')
          match_builder.column(server.plugins['hapi-shelf'].knex.raw(score_raw))
          match_builder.innerJoin('survey_response', 'survey_answer.survey_response_id', 'survey_response.id')
          match_builder.innerJoin('candidate_answer', 'survey_answer.answer_id', 'candidate_answer.answer_id')
          match_builder.innerJoin('candidate_geography', function() {
            this.on('candidate_answer.candidate_id', '=', 'candidate_geography.candidate_id')
            .andOn('candidate_geography.geography_id', '=', 'survey_response.geography_id')
          })
          match_builder.innerJoin('candidate', 'candidate_answer.candidate_id', 'candidate.id')
          match_builder.innerJoin('candidate_type', 'candidate.candidate_type_id', 'candidate_type.id')
          match_builder.where('survey_response.id', request.params.survey_response_id)
          match_builder.groupBy('survey_response.id', 'survey_response.geography_id'
          , 'candidate_answer.candidate_id', 'candidate.candidate_name'
          , 'candidate_type.id', 'candidate_type.type_name')
        })
        .fetchAll()
        .then(matches => {
          getCategoryScores(request.params.survey_response_id, function(categories) {
            getCategoryAnswers(request.params.survey_response_id, function(answers) {
              reply(formatCandidateMatch(matches.models, categories.models, answers.models))
            })
          })
        })
      })
    }
  }]
}
