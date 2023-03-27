const client = require("./client");

client.getAll({}, (error, mahasiswa) => {
    if (!error) {
      console.log('successfully fetch data')
      console.log(mahasiswa)
    } else {
      console.error(error)
    }
  })

  client.addMahasiswa(
    {
        id: "3",
        nama: "Rudi",
        nrp: "5119",
        nilai: 90
    },
    (error, mahasiswa) => {
        if (!error) {
            console.log('successfully created data')
            console.log(mahasiswa)
        } else {
            console.error(error)
        }
    }
  )