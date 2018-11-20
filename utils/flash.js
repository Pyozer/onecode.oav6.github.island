function setFlash(req, type, message) {
    req.session.flash = {
        type: type,
        message: message
    }
}

function flash(req) {
    if (!req.session.flash) return null

    const flashMsg = {
        type: req.session.flash.type,
        message: req.session.flash.message
    }
    req.session.flash = null

    return flashMsg
}

module.exports = {
    setFlash,
    flash
}