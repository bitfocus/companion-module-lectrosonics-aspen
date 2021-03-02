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
      this.debug('Initiating socket...')
      this.socket = new TCP(this.config.host, this.config.port)

      this.socket.on('status_change', (status, message) => {
        this.status(status, message)
      })

      this.socket.on('error', (err) => {
        this.debug('Network error', err)
        this.log('error', 'Network error: ' + err.message)
      })

      let buffer = ''

      this.socket.on('data', data => {
        buffer += data.toString()

        if (buffer.endsWith('\r\n')) {
          this.debug('Data', buffer)
          // let xmlBuffer = '';

          // buffer.split('\r\n')
          //   .filter(message => message != '')
          //   .forEach(message => {
          //     // Check if fragment is XML data
          //     if (message.startsWith('<vmix>') || xmlBuffer.length > 0) {
          //       xmlBuffer += message;
          //       if (xmlBuffer.includes('<vmix>') && xmlBuffer.includes('</vmix>')) {
          //         processMessages(xmlBuffer);
          //         xmlBuffer = '';
          //       }
          //     } else {
          //       processMessages(message);
          //     }
          //   });

          buffer = ''
        }
      })
    }
  },

  sendTCP (payload) {
    this.log('debug', `Sending ${payload} to ${this.socket.host}...`)
    this.socket.send(payload)
  }
}
