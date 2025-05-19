import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import FeatureRequest from "./FeatureRequest";
import Posts from "./Posts";
import PostCard from "./Posts/PostCard";
import { Header } from "../../Header";

export default function Main() {
  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <Header />

      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/post/:postId" element={<PostCard />} />
        <Route path="/feature-request" element={<FeatureRequest />} />
      </Routes>

      <Toaster theme="system" />
    </div>
  );
}
