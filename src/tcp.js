const TCP = require('../../../tcp')

module.exports = {
  /**
   * Inits the TCP connection and updates status
   */
  initTCP () {
    if (this.socket !== undefined) {
      this.socket.destroy()
      delete this.socket
    }

    if (this.config.host) {
      this.socket = new TCP(this.config.host, this.config.port)

      this.socket.on('status_change', (status, message) => {
        this.status(status, message)
      })

      this.socket.on('error', (err) => {
        this.debug('Network error', err)
        this.log('error', 'Network error: ' + err.message)
      })
    }
  }
}
