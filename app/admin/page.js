"use client";

import { useEffect, useState } from "react";
import { db, storage, auth } from "../../lib/firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

export default function Admin() {
  const [mounted, setMounted] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [category, setCategory] = useState("Wedding");

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setBookings(data);
  };

  // 🔐 AUTH TRACK
  useEffect(() => {
    fetchBookings();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);


  const deleteBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;

    try {
      await deleteDoc(doc(db, "bookings", id));

      // 🔥 Update UI instantly
      setBookings((prev) => prev.filter((b) => b.id !== id));

    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  // ✅ FIXED LOGIN
  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) fetchImages();
  }, [mounted]);

  const fetchImages = async () => {
    const querySnapshot = await getDocs(collection(db, "gallery"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setImages(data);
  };

  // 📸 Upload Image
  const uploadImage = async () => {
    try {
      if (!imageFile) return alert("Select image");

      if (!imageFile.type.startsWith("image/")) {
        return alert("Only images allowed ❌");
      }

      setLoading(true);

      const storageRef = ref(
        storage,
        `gallery/${Date.now()}-${imageFile.name}`
      );

      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "gallery"), {
        title: imageFile.name,
        category: category,
        imageUrl: url,
        createdAt: Date.now()
      });

      setSuccess("Image Uploaded Successfully 🎉");
      setImageFile(null);
      fetchImages();

    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🎬 Upload Video
  const uploadVideo = async () => {
    try {
      if (!videoFile) return alert("Select video");

      if (!videoFile.type.startsWith("video/")) {
        return alert("Only video allowed ❌");
      }

      setLoading(true);

      const storageRef = ref(
        storage,
        `videos/${Date.now()}-${videoFile.name}`
      );

      await uploadBytes(storageRef, videoFile);
      const url = await getDownloadURL(storageRef);

      await setDoc(doc(db, "settings", "hero"), {
        videoUrl: url
      });

      setSuccess("Hero Video Updated 🎬");

    } catch (err) {
      console.error(err);
      alert("Video upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete Image
  const deleteImage = async (id, imageUrl) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteDoc(doc(db, "gallery", id));

      const path = decodeURIComponent(
        imageUrl.split("/o/")[1].split("?")[0]
      );

      await deleteObject(ref(storage, path));

      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  if (!mounted) return null;

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f1f1c] to-black text-white">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-80 shadow-xl border border-white/20">
          <h2 className="text-xl mb-6 text-[#D4AF37] text-center font-semibold">
            Admin Login
          </h2>

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full p-3 mb-4 rounded-lg bg-white text-black"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full p-3 mb-6 rounded-lg bg-white text-black"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black py-3 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f1f1c] to-black text-white p-10">

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-lg transition"
      >
        Logout
      </button>

      <h1 className="text-4xl font-bold mb-12 text-center text-[#D4AF37]">
        Infinity Events Admin Panel
      </h1>

      {success && (
        <p className="text-green-400 text-center mb-6">{success}</p>
      )}

      {/* 📸 IMAGE UPLOAD */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl mb-10">
        <h2 className="text-2xl mb-6 text-[#D4AF37] font-semibold">
          Upload Gallery Image
        </h2>

        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (!file.type.startsWith("image/")) {
              alert("Only images allowed ❌");
              return;
            }
            setImageFile(file);
          }}
          className="border-2 border-dashed border-[#D4AF37] p-6 text-center rounded-xl cursor-pointer block"
        >
          Click or Drag Image

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file.type.startsWith("image/")) {
                alert("Only images allowed ❌");
                return;
              }
              setImageFile(file);
            }}
          />
        </label>

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            className="w-40 h-40 mt-4 rounded-lg"
          />
        )}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mt-4 p-3 bg-black text-white rounded-xl border border-[#D4AF37]/40"
        >
          <option value="Wedding">Wedding</option>
          <option value="Birthday">Birthday</option>
          <option value="Pre-Wedding">Pre-Wedding</option>
          <option value="Engagement">Engagement</option>
        </select>

        <button
          onClick={uploadImage}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 
        text-black font-semibold py-3 rounded-xl shadow-lg 
        hover:scale-105 transition duration-300"
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* 🎬 VIDEO UPLOAD */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl mb-10">
        <h2 className="text-2xl mb-6 text-purple-400 font-semibold">
          Upload Hero Video
        </h2>

        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (!file.type.startsWith("video/")) {
              alert("Only video allowed ❌");
              return;
            }
            setVideoFile(file);
          }}
          className="border-2 border-dashed border-purple-400 p-6 text-center rounded-xl cursor-pointer block"
        >
          Click or Drag Video

          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file.type.startsWith("video/")) {
                alert("Only video allowed ❌");
                return;
              }
              setVideoFile(file);
            }}
          />
        </label>

        {videoFile && (
          <video
            src={URL.createObjectURL(videoFile)}
            controls
            className="w-full mt-4 rounded-lg"
          />
        )}

        <button
          onClick={uploadVideo}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 
        py-3 rounded-xl font-semibold shadow-lg 
        hover:scale-105 transition duration-300"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </div>

      {/* 📸 GALLERY */}
      <div>
        <h2 className="text-2xl mb-6 text-center text-[#D4AF37]">
          Manage Gallery
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <img
                src={img.imageUrl}
                className="w-full h-40 object-cover"
              />

              <div className="p-4 text-center">
                <p>{img.title}</p>
                <p className="text-sm text-gray-400">{img.category}</p>

                <button
                  onClick={() =>
                    deleteImage(img.id, img.imageUrl)
                  }
                  className="mt-3 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20">
        <h2 className="text-2xl text-[#D4AF37] mb-6">
          Client Bookings
        </h2>

        <div className="grid gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white/5 border border-white/10 p-5 rounded-xl shadow-lg"
            >
              <p><b>Name:</b> {b.name}</p>
              <p><b>Email:</b> {b.email}</p>
              <p><b>Phone:</b> {b.phone}</p>
              <p><b>Event:</b> {b.eventType}</p>
              <p><b>Date:</b> {b.date}</p>
              <p><b>Message:</b> {b.message}</p>

              {/* 🔥 DELETE BUTTON */}
              <button
                onClick={() => deleteBooking(b.id)}
                className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Delete Booking
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}