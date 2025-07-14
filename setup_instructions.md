# Image Generation Setup Instructions

## 1. Install Dependencies

```bash
pip install -r requirements.txt
```

## 2. Set Up OpenAI API Key

Create a `.env` file in the project root with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

**How to get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key and paste it in the `.env` file

## 3. Run the Image Generation Script

```bash
python generate_images.py
```

This will:
- Generate 20 unique images based on the game's scene prompts
- Save them as `scene_01.png`, `scene_02.png`, etc. in the `images/` folder
- Update the game to use the generated images

## 4. Cost Estimate

DALL-E 3 pricing (as of 2024):
- Standard quality (1024x1024): ~$0.040 per image
- **Total cost for 20 images: ~$0.80**

## 5. Generated Files

The script will create:
- `images/scene_01.png` - Βιβλιοθήκη Γνώσης
- `images/scene_02.png` - Κάστρο - Ελαττωματικός Έλεγχος Πρόσβασης
- `images/scene_03.png` - Θησαυροφυλάκιο - Κρυπτογραφικές Αποτυχίες
- ... and so on for all 20 scenes

## 6. Game Integration

The script will automatically update the game to use the correct image for each question based on the question ID.

## Troubleshooting

- **API Key Error**: Make sure your `.env` file is in the project root and contains a valid OpenAI API key
- **Rate Limiting**: The script includes a 2-second delay between requests to avoid rate limits
- **Failed Images**: If some images fail to generate, you can run the script again - it will skip existing images

## Example .env file format:

```
OPENAI_API_KEY=sk-proj-abcdef123456789...
``` 