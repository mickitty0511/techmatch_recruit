import { useState, useRef, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import JobPreviewModal from '../../components/JobPreviewModal' // 追加

// モーダルコンポーネント
const FileUploadModal = ({ isOpen, onClose, onFileSelect }) => {
  const fileInputRef = useRef(null) // input 要素への参照を作成
  const [isLoading, setIsLoading] = useState(false) // ローディング状態を追加

  const handleButtonClick = () => {
    fileInputRef.current.click() // input 要素のクリックイベントをトリガー
  }

  const handleFileChange = (e) => {
    setIsLoading(true) // ローディング開始
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const text = event.target.result
      onFileSelect(text).then(() => {
        setIsLoading(false) // ローディング終了
        onClose() // ポップアップを閉じる
      })
    }

    reader.readAsText(file)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg p-6">
        {/* ローディングインジケーター */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <div className="loader"></div>
          </div>
        )}
        <h2 className="text-lg font-bold mb-4">ファイルから求人票を作成</h2>
        <p className="text-gray-700 mb-6">Word, テキスト, PDF, Markdown 形式のファイルを選択してください。</p>
        <input
          type="file"
          accept=".doc,.docx,.txt,.pdf,.md"
          onChange={handleFileChange}
          className="hidden" // input 要素を非表示にする
          ref={fileInputRef} // input 要素への参照を設定
        />
        <button
          type="button" // submit イベントを防ぐために type="button" を指定
          onClick={handleButtonClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300" // ボタンのデザインを合わせる
        >
          ファイルを選ぶ {/* テキストを合わせる */}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ml-4"
        >
          閉じる
        </button>
      </div>
    </div>
  )
}

// 新しいモーダルコンポーネント
const NewModal = ({ isOpen, onClose, isLoading }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg p-6">
        {/* ローディングインジケーター */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <div className="loader"></div>
          </div>
        )}
        <h2 className="text-lg font-bold mb-4">ファイルを読み込んでいます...</h2>
      </div>
    </div>
  )
}

const PostJobPage = () => {
  const [jobPost, setJobPost] = useState({
    title: '',
    description: '',
    requirements: '',
    company: '',
    // 新しいフィールドを追加
    location: '',
    salary: '',
    employmentType: '',
    applicationDeadline: ''
  })

  const [isLoading, setIsLoading] = useState(false); // ローディング状態を追加

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // プレビューモーダルの状態

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormFilled()) {
      setIsPreviewModalOpen(true); // プレビューモーダルを開く
    }
  }

  const fileInputRef = useRef(null) // input 要素への参照を作成

  const handleButtonClick = () => {
    fileInputRef.current.click() // input 要素のクリックイベントをトリガー
    fileInputRef.current.value = '' // input 要素の値をクリア
  }

  const [isModalOpen, setIsModalOpen] = useState(false) // モーダルの表示状態
  const [isNewModalOpen, setIsNewModalOpen] = useState(false) // 新しいモーダルの状態
  const [isLoadingNewModal, setIsLoadingNewModal] = useState(false) // 新しいモーダルのローディング状態

  useEffect(() => {
    setIsModalOpen(true) // ページ読み込み時にモーダルを表示
  }, [])

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleModalFileSelect = async (text) => {
    await extractJobDataFromText(text).then(jobData => {
      if (jobData) {
        setJobPost({ ...jobPost, ...jobData })
      }
    })
  }

  const handleNewModalOpen = () => {
    setIsNewModalOpen(true)
    setIsLoadingNewModal(true) // ローディング開始
    // ここで何らかの処理を行う (例: API呼び出し)
    setTimeout(() => {
      setIsLoadingNewModal(false) // ローディング終了 (デモ purposes)
    }, 2000)
  }

  const handleNewModalClose = () => {
    setIsNewModalOpen(false)
  }

  const formatDate = (dateString) => {
    // "2024年10月31日" のような形式に対応
    const parts = dateString.match(/(\d+)年(\d+)月(\d+)日/);
    if (parts) {
      const year = parseInt(parts[1], 10);
      const month = parseInt(parts[2], 10);
      const day = parseInt(parts[3], 10);
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } else {
      // 従来の形式もサポート
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
  };

  const extractJobDataFromText = async (text) => {
    try {
      const response = await fetch('/api/extract-job-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const data = await response.json();

        // 'applicationDeadline' をフォーマットする
        if (data.applicationDeadline) {
          data.applicationDeadline = formatDate(data.applicationDeadline);
          console.log(data.applicationDeadline);
        }

        return data;
      } else {
        console.error('サーバーからエラーが返されました。');
        return null;
      }
    } catch (error) {
      console.error('求人情報の抽出中にエラーが発生しました:', error);
      return null;
    }
  };

  const handleFileChange = (e) => {
    setIsLoading(true) // フォーム側のローディング開始
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const text = event.target.result
      setIsNewModalOpen(true) // 新しいモーダルを開く
      setIsLoadingNewModal(true) // 新しいモーダルのローディング開始
      extractJobDataFromText(text).then(jobData => {
        if (jobData) {
          setJobPost({ ...jobPost, ...jobData })
        }
        setIsLoading(false) // フォーム側のローディング終了
        setIsLoadingNewModal(false) // 新しいモーダルのローディング終了
        setIsNewModalOpen(false) // 新しいモーダルを閉じる
      })
    }

    reader.readAsText(file)
  }

  // body要素にoverflow-hiddenクラスを追加/削除する関数
  const toggleBodyOverflow = (isModalOpen) => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  // プレビューモーダルの表示状態が変更されたときにbody要素のoverflowを変更
  useEffect(() => {
    toggleBodyOverflow(isPreviewModalOpen);
  }, [isPreviewModalOpen]);

  const isFormFilled = () => {
    return Object.values(jobPost).every(value => value !== '');
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden relative"> {/* relative を追加 */}
      {/* バツアイコン
      {isPreviewModalOpen && (
        <button
          onClick={() => setIsPreviewModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50" // z-index を調整
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )} */}

      <PageHeader
        title="求人票作成"
        description="求人票を作成してください。"
        bgColor="bg-green-50"
        textColor="text-green-800"
        borderColor="border-green-100"
      />
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="file"
              id="file"
              accept=".doc,.docx,.txt,.pdf,.md"
              onChange={handleFileChange}
              className="hidden" // input 要素を非表示にする
              ref={fileInputRef} // input 要素への参照を設定
            />
            <button
              type="button" // submit イベントを防ぐために type="button" を指定
              onClick={handleButtonClick}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300" // w-full を削除
            >
              ファイルから求人票を自動作成 {/* テキストを追加 */}
            </button> {/* カスタムボタン */}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">職種</label>
            <input
              type="text"
              id="title"
              value={jobPost.title}
              onChange={(e) => setJobPost({ ...jobPost, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">会社名</label>
            <input
              type="text"
              id="company"
              value={jobPost.company}
              onChange={(e) => setJobPost({ ...jobPost, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">仕事内容</label>
            <textarea
              id="description"
              value={jobPost.description}
              onChange={(e) => setJobPost({...jobPost, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">勤務地</label>
            <input
              type="text"
              id="location"
              value={jobPost.location}
              onChange={(e) => setJobPost({ ...jobPost, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">給与</label>
            <input
              type="text"
              id="salary"
              value={jobPost.salary}
              onChange={(e) => setJobPost({ ...jobPost, salary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">応募資格</label>
            <textarea
              id="requirements"
              value={jobPost.requirements}
              onChange={(e) => setJobPost({...jobPost, requirements: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">雇用形態</label>
              <input
                type="text"
                id="employmentType"
                value={jobPost.employmentType}
                onChange={(e) => setJobPost({...jobPost, employmentType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">応募締切</label>
              <input
                type="date"
                id="applicationDeadline"
                value={jobPost.applicationDeadline}
                onChange={(e) => setJobPost({...jobPost, applicationDeadline: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed" disabled={!isFormFilled()}>
            求人票をプレビュー
          </button>
        </form>
      </div>

      <FileUploadModal // モーダルコンポーネントを追加
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onFileSelect={handleModalFileSelect}
      />

      {/* 新しいモーダル */}
      <NewModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        isLoading={isLoadingNewModal}
      />

      {/* プレビューモーダル */}
      <JobPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        jobPost={jobPost}
      />
    </div>
  )
}

export default PostJobPage