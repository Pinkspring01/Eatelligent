import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from dotenv import load_dotenv

load_dotenv('server/config.env')

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:5173'])  # FIX: Add credentials support

def get_recipe_generator_prompt():
    system_prompt = """Your task is to create practical, delicious recipes using available ingredients.
    RULES: 
    1. MINIMIZE the number of ingredients that are not in the provided fridge/pantry list
    2. Prioritize ingredients that expire soonest (check expiration dates)
    3. Respect ALL dietary restrictions (allergies, preferences, etc.)
    4. Create complete, tested recipes with precise measurements
    5. Return ONLY valid JSON, no markdown, no extra text
     
    OUTPUT FORMAT:
    {
        "recipes": [
            {
                "name": "Recipe Name",
                "difficulty": "easy|medium|hard",
                "prep_time_minutes": 15,
                "cook_time_minutes": 30, 
                "servings": 4,
                "ingredients": [
                    {
                        "item": "ingredient name from list",
                        "amount": "2 cups",
                        "already_exists": true
                    }, 
                    {
                        "item": "ingredient name from list",
                        "amount": "1/2 cup",
                        "already_exists": false
                    }
                ],
                "instructions": [
                    "Step 1: Do this...",
                    "Step 2: Do that..."
                ],
                "expiring_soon": ["ingredient1", "ingredient2"],
                "dietary_info": {
                    "vegetarian": true,
                    "vegan": false,
                    "gluten_free": false,
                    "dairy_free": true
                }
            }
        ]
    }
     
    GOOD PRACTICES:
    - Minimize food waste by using expiring items first
    - Creative titles for meals
    - Have diversity in recipes in terms of time, cuisine, and difficulty level"""

    return system_prompt

def get_user_data(fridge, pantry, dietary_restrictions, preferences):
    user_prompt = f"""
    FRIDGE INVENTORY: {fridge}
    PANTRY INVENTORY: {pantry}
    DIETARY RESTRICTIONS: {dietary_restrictions}
    USER PREFERENCES: {preferences}
    Generate diverse recipes using this information. Prioritize items expiring within 3 days."""

    return user_prompt
     

class LLMClient:
    def __init__(self, model="meta-llama/Llama-3.1-8B-Instruct"):
        self.api_url = "https://router.huggingface.co/v1/chat/completions"
        self.model = model
        self.headers = {
            "Authorization": f"Bearer {os.getenv('HF_TOKEN')}",
            "Content-Type": "application/json"
        }
    
    def chat(self, prompt, system_prompt=None, max_tokens=500, temperature=0.7, max_retries=3):
        
        messages = []
        if system_prompt != None:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }

        try: 
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload,
                timeout=60
            )

            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                return f"Error: {response.status_code} - {response.text}"
        except Exception as e: 
                return f"Error: {str(e)}"
        
@app.route('/generate-recipes', methods=['POST'])
def generate_recipes():
    try:
        data = request.json
        
        fridge = data.get('fridge', [])
        pantry = data.get('pantry', [])
        dietary_restrictions = data.get('dietaryRestrictions', [])  # FIX: Match frontend key
        preferences = data.get('preferences', '')
        
        # Initialize LLM client
        client = LLMClient()
        
        # Generate prompts
        system_prompt = get_recipe_generator_prompt()
        user_prompt = get_user_data(fridge, pantry, dietary_restrictions, preferences)
        
        # Get response from LLM
        response = client.chat(user_prompt, system_prompt=system_prompt, max_tokens=2000)
        
        # Try to parse as JSON (strip markdown if present)
        import json
        response_clean = response.strip()
        if response_clean.startswith('```'):
            response_clean = response_clean.split('```')[1]
            if response_clean.startswith('json'):
                response_clean = response_clean[4:]
        
        recipes = json.loads(response_clean)
        
        return jsonify(recipes), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)