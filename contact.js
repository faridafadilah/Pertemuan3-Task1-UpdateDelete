const fs = require('fs'); // Core module filesystem
const validator = require('validator'); // Core Module Validasi


// Cek Folder Data
const dirPath = './data';
if(!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Cek FIle contact.json
const filePath = './data/contact.json';
if(!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
}

// Membaca Data
const loadContact = () => {
  const file = fs.readFileSync(filePath, 'utf-8'); // Membaca file
  const contacts = JSON.parse(file); // Mengubah data ke JSON
  return contacts;
}

// Simpan data 
const SaveContact = (nama, email, nohp) => {
  const contact = {nama, nohp, email}; // Menampung  data ke dalam object 
  const contacts = loadContact(); // Membaca data memanggil Fungsi loadContact

  // Cek Duplikat Nama
  const duplikat = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase() );
  if(duplikat) {
    console.log('Maaf, Contact yang anda masukan sudah tersedia.');
    return false;
  }
  
  //Cek Email
  if(email) {
    if(!validator.isEmail(email)) {
      console.log('Maaf Email Tidak Valid!');
      return false;
    }
  }

  // Cek Mobile Phone
  if(!validator.isMobilePhone(nohp, 'id-ID')) {
    console.log('Maaf No Hp Tidak Valid!');
    return false;
  }

  contacts.push(contact); // Push data
  // Tulis data ke file dan ubah ke string
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
  console.log('Terima Kasih! Sudah mengisi data');
}

// List Contact
const listContact = () => {
  const contacts = loadContact();
  console.log('Daftar Contact');
  contacts.forEach((contact, i) => {
    console.log(`${i+1}. ${contact.nama} - ${contact.nohp}`);
  });
}

// Detail Contact
const detailContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  // Cek Nama Contact
  if(!contact) {
    console.log(`${nama} Tidak ditemukan!`);
    return false;
  }
  
  // Tampilkan Detail
  console.log(`Nama: ${contact.nama}`);
  console.log(`No HP: ${contact.nohp}`);

  // Cek Email
  if(contact.email) {
    console.log(`Email: ${contact.email}`);
  }
}

// Menghapus Contact
const deleteContact = (nama) => {
  const contacts = loadContact();
  const NewContact = contacts.filter((contact) => contact.nama.toLowerCase() !== nama.toLowerCase());
  // console.log(NewContact);
  // Cek Length Data Contact Lama dan Baru
  if(contacts.length === NewContact.length) {
    console.log('Nama Contact tidak ada!');
    return false;
  }

  contacts.push(NewContact); // Push data
  // Tulis data ke file dan ubah ke string
  fs.writeFileSync(filePath, JSON.stringify(NewContact, null, 2));
  console.log('Data terhapus!');
}

// Mengupdate Contact
const updateContact = (oldnama, nama, email, nohp) => {
  const contacts = loadContact(); // Data
  // Memfilter contact yang tidak sama
  const NewContact = contacts.filter((contact) => contact.nama.toLowerCase() !== oldnama.toLowerCase());

  // Cek length Contact jika sama maka data tidak ada
  if(contacts.length === NewContact.length) {
    console.log('Nama Contact tidak ada!');
    return false;
  }

  // Mencari data Lama
  const OldContact = contacts.find((contact) => contact.nama.toLowerCase() === oldnama.toLowerCase());
  const index = contacts.indexOf(OldContact); // Mengembalikan Posisi Pertama Jadi ditentukan

  // Jika nama diubah
  if(nama) {
    // Cek Duplikat Nama
    const duplikat = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase() );
    if(duplikat) {
      console.log('Maaf, Contact yang anda masukan sudah tersedia.');
      return false;
    }
    contacts[index].nama = nama; 
  }

  //Jika Email diubah
  if(email) {
    if(!validator.isEmail(email)) {
      console.log('Maaf Email Tidak Valid!');
      return false;
    }
    contacts[index].email = email;
  }

  // Jika No hp diubah
  if(nohp) {
    if(!validator.isMobilePhone(nohp, 'id-ID')) {
      console.log('Maaf No Hp Tidak Valid!');
      return false;
    }
    contacts[index].nohp = nohp;
  }

  // Save Data yang sudah di Update
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
  console.log('Data Contact Berhasil di Update!');
}

module.exports = { SaveContact, listContact, detailContact, deleteContact, updateContact };