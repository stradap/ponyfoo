'use strict'

const moment = require(`moment`)
const sluggish = require(`sluggish`)
const validator = require(`validator`)
const WeeklyIssueSubmission = require(`../../../models/WeeklyIssueSubmission`)
const weeklySubmissionService = require(`../../../services/weeklySubmission`)
const markupService = require(`../../../services/markup`)
const dateFormat = `YYYY-MM-DD`
const subtypes = [`suggestion`, `primary`, `secondary`, `job`]

function post (req, res, next) {
  const slug = req.params.slug
  const inputSlug = getInputSlug()
  const editing = !!slug
  const query = {
    slug: slug || inputSlug
  }

  WeeklyIssueSubmission.findOne(query, found)

  function getInputSlug () {
    const input = req.body || {}
    const section = input.section || {}
    const submitter = input.submitter || {}
    const title = section.title || ``
    const email = submitter.email || ``
    const inputSlug = sluggish(title + `-` + email.split(`@`)[0])
    return inputSlug
  }

  function found (err, submission) {
    if (err) {
      next(err); return
    }
    if (editing && !submission) {
      res.status(404).json({ messages: [`Submission not found!`] }); return
    } else if (!editing && submission) {
      res.status(400).json({ messages: [`You’ve already submitted that link!`] }); return
    }
    if (!editing) {
      update({}, req.body); return
    }

    const options = {
      submission: submission,
      userId: req.user,
      verify: req.query.verify
    }
    weeklySubmissionService.isEditable(options, proceed)
    function proceed (err, submission, isOwner) {
      if (err) {
        next(err); return
      }
      update(submission, req.body, isOwner)
    }
  }
  function update (model, changes, isOwner) {
    const result = validateChanges(model, changes, isOwner)
    if (result.errors.length) {
      res.status(400).json({ messages: result.errors }); return
    }
    if (editing) {
      result.model.save(saved)
    } else {
      new WeeklyIssueSubmission(result.model).save(notify)
    }
  }
  function notify (err, submission) {
    if (err) {
      next(err); return
    }
    weeklySubmissionService.notifyReceived(submission)
    saved(null)
  }
  function saved (err) {
    if (err) {
      next(err); return
    }
    res.json({})
  }
  function validateChanges (model, input, isOwner) {
    const rstrip = /^\s*<p>\s*<\/p>\s*$/i
    const errors = []
    const sponsor = !!input.sponsor
    if (!input.submitter) { input.submitter = {} }
    if (!input.section) { input.section = {} }
    if (!input.sponsor) { input.sponsor = {} }
    if (editing) {
      if (model.status !== `incoming` && !isOwner) {
        errors.push(`You aren’t allowed to update the submission status.`)
      }
    }
    const email = input.submitter.email
    if (!validator.isEmail(email)) {
      errors.push(`You must provide us with your email address, so that we can reach out to you.`)
    }
    if (!input.section.href) {
      errors.push(`Submitting a link is kind of the point. Please make sure to give us at least that!`)
    }
    if (!input.section.title) {
      errors.push(`A link without a title is like an island without a shore. Hard to fathom its existence!`)
    }
    if (errors.length) {
      return { errors: errors }
    }
    const subtype = subtypes.indexOf(input.section.subtype) === -1 ? `suggestion` : input.section.subtype
    if (!editing) {
      model.status = `incoming`
      model.slug = inputSlug
      model.section = {
        type: `link`,
        foreground: `#1bc211`,
        background: `transparent`,
        tags: []
      }
    } else {
      model.markModified(`section`)
    }
    model.submitter = input.submitter.name
    model.email = email
    model.comment = input.submitter.comment
    model.commentHtml = markupService.compile(input.submitter.comment).replace(rstrip, ``)
    model.type = sponsor ? `sponsor` : `suggestion`
    model.subtype = subtype
    model.section.sponsored = sponsor
    model.section.subtype = subtype
    model.section.title = input.section.title
    model.section.href = input.section.href
    model.section.source = input.section.source
    model.section.sourceHref = input.section.sourceHref
    model.section.image = input.section.image
    model.section.description = input.section.description
    if (sponsor) {
      model.amount = Math.max(parseInt(input.sponsor.amount, 10), 1)
      model.invoice = !!input.sponsor.invoice
      model.dates = Array.isArray(input.sponsor.dates) ? input.sponsor.dates.map(toDate) : []
    } else {
      model.amount = 0
      model.invoice = false
      model.dates = []
    }
    return { errors: errors, model: model }
  }
}

function toDate (date) {
  return moment.utc(date, dateFormat).toDate()
}

module.exports = post
