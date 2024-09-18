import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

  // 環境変数からAPIキーを取得
  const generativeAi = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

  // JSON Schema の定義
  const schema: SchemaType = {
    description: "Job Description",
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING, description: "職種" },
        company: { type: SchemaType.STRING, description: "会社名" },
        description: { type: SchemaType.STRING, description: "仕事内容" },
        location: { type: SchemaType.STRING, description: "勤務地" },
        salary: { type: SchemaType.STRING, description: "給与" },
        requirements: { type: SchemaType.STRING, description: "応募資格" },
        employmentType: { type: SchemaType.STRING, description: "雇用形態" },
        applicationDeadline: { type: SchemaType.STRING, description: "応募締切" }
    },
    required: [
        "title",
        "company",
        "description",
        "location",
        "salary",
        "requirements",
        "employmentType",
        "applicationDeadline"
    ]
  };

  // モデルの取得
  const model = generativeAi.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
        responseSchema: schema,
        responseMimeType: "application/json",
    },
  });

  console.log(`${text}`);

  try {
    // テキスト生成
    const result = await model.generateContent(
      `次のテキストから求人票情報をJSON形式で抽出してください。
      titleは「Reactエンジニア」のような形式で出力してください。
      locationは「東京都渋谷区神南2-1-1 クリエイティブタワー15階」のようにビルと階数までの形式で出力してください。
      salaryは「300万円〜400万円」のように給与の範囲を出力してください。
      descriptionとrequirementsはBullet List形式で改行コードをつけて出力してください。
      applicationDeadlineだけ「2024年10月31日」のような形式で出力してください。
      ハルシネーションしないで。
\`\`\`
${text}
\`\`\``
    );

    console.log('API Response:', result);

    let responseText = '';
    if (result.response) {
      responseText = await result.response.text();
      console.log('Response Text:', responseText);
    } else {
      throw new Error('API response does not contain expected data');
    }

    try {
      const data = JSON.parse(responseText);
      res.status(200).json(data);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      res.status(500).json({ error: '無効なJSONレスポンスを受け取りました。' });
    }
  } catch (error) {
    console.error('Google Generative AI の呼び出しに失敗しました:', error);
    res.status(500).json({ error: '求人情報の抽出に失敗しました。' });
  }
}