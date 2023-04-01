const Patient = require('./../../models/patient');
const events = require('./../events')

module.exports =  function addPatientEvents(socket){
  // Listen for patient patient events
  socket.on(events.PATIENT.SHARE, (patientData) => {
    console.log(patientData);
    patientData['senderId'] = user._id
    patientData['status'] = 'unseen'
    const patient = new Patient(patientData)
    let validationError = patient.validateSync()
    if (validationError) {
      // console.log(JSON.parse(JSON.stringify(validationError)));
      socket.emit('error', validationError)
      return;
      // handleSocketError({}, validationError)
    }

    //check: receiverId in user.connections
    if (user.connections.indexOf(patient._doc.receiverId) < 0) {
      socket.emit('error', {
        'errors': {
          'receiverId': {
            stringValue: patient._doc.receiverId,
            patient: 'receiver not in your connections, cant send patient to him/her...'
          }
        }
      })
      return;
    }
    console.log('checkes passed, saving to db...');

    //save patient into database
    patient.save()
      .then(dbResponse => {
        // console.log(dbResponse); //updated  document...
        socket.emit(events.PATIENT.SENDING, patient._doc) //single tick

        if (clients[patient._doc.receiverId]) {
          console.log('sending patient to', patient._doc.receiverId);
          // Patient.findByIdAndUpdate(patient._doc._id, { $set: { status: 'sent', sentAt: Date() } })
          clients[patient._doc.receiverId].emit(events.PATIENT.SHARE, patient._doc)
          // socket.emit(events.PATIENT.SENT, patient._doc) //double tick
        }
      })
  });

  // receiver emits this event when patient box is opened
  socket.on(events.PATIENT.SEEN, async (patientData) => {
    //update status to seen in database
    let updatedPatient, patientId;
    try {
      patientId = await isIDGood(patientData._id)
      updatedPatient = await Patient.findOneAndUpdate(
        { _id: patientId, status: 'unseen', receiverId: user._id },
        { $set: { status: 'seen', seenAt: Date.now() } },
        { returnDocument: 'after' }
      )


      //if sender is online, send event patient:seen to him
      let senderId = await isIDGood(patientData.senderId)
      if (!updatedPatient) {
        socket.emit('error', { patient: 'no received patient with given _id and unseen status found!' })
        return;
      }
      if (clients[senderId] && updatedPatient) {
        clients[senderId].emit(events.PATIENT.SEEN, updatedPatient)
      }
    } catch (error) {
      console.error(error);
      socket.emit('error', error)
    }
  })
}
