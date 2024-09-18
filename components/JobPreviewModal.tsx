import React, { useState, useEffect } from 'react';

interface JobPost {
  title: string;
  description: string;
  requirements: string;
  company: string;
  location: string;
  salary: string;
  employmentType: string;
  applicationDeadline: string;
}

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPost: JobPost;
  onPost: () => void;
}

const JobPreviewModal: React.FC<JobPreviewModalProps> = ({ isOpen, onClose, jobPost, onPost }) => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateJobImage();
    }
  }, [isOpen, jobPost]);

  const generateJobImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-job-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobPost }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error generating job image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // 改行コードを<br>タグに変換する関数
  const convertLineBreaks = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  // 当日の日付を取得
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl z-50"
      >
        &times;
      </button>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full overflow-y-auto max-h-[90vh] shadow-lg relative z-50">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">求人票プレビュー</h2>
        <p className="text-center mb-4 text-gray-600">この求人票は、実際に掲載される内容です。</p>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : generatedImageUrl ? (
          <div className="mb-6">
            <img src={generatedImageUrl} alt="Job Posting Image" className="w-full rounded-lg shadow-md" />
          </div>
        ) : null}

        <div className="border rounded-md p-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{jobPost.title}</h3>
            <div className="text-sm text-gray-500">
              応募締切: {jobPost.applicationDeadline}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <p className="mb-1 text-gray-600"><strong>投稿日:</strong></p>
              <p>{today}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-600"><strong>会社名:</strong></p>
              <p>{jobPost.company}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-600"><strong>勤務地:</strong></p>
              <p>{jobPost.location}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-600"><strong>給与:</strong></p>
              <p>{jobPost.salary}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-600"><strong>雇用形態:</strong></p>
              <p>{jobPost.employmentType}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <p className="mb-1 text-gray-600"><strong>仕事内容</strong></p>
              <p className="whitespace-pre-wrap">{jobPost.description}</p>
            </div>
            <div>
              <p className="mb-1 text-gray-600"><strong>応募資格</strong></p>
              <p className="whitespace-pre-wrap">{jobPost.requirements}</p>
            </div>
          </div>
        </div>
        <p className="text-center mt-4 text-gray-600">確認できたら、投稿してください</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-4 shadow-md"
          >
            修正する
          </button>
          <button
            onClick={onPost}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-md"
          >
            投稿する
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPreviewModal;