import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

def get_recipe_generator_prompt():
    system_prompt = """Your task is to create practical, delicious recipes using available ingredients.
    RULES: 
    1. MINMIZE the number of ingredients that are not in the provided fridge/pantry list
    2. Priortize ingredients that expire soonest (check expiration dates)
    3. Respect ALL dietary restricitions (allergies, preferences, etc.)
    4. Create complete, tested recipes with precise measurements
    5. Return ONLY valid JSON, no markdown, no extra text
     
    OUTPUT FORMAT:
    {
        "recipes": [
            {
                "name": "Recipe Name",
                "diffculty": "easy|medium|hard",
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
                        "item" "ingredient name from list"
                        "amount": "1/2 cup",
                        "already_exists": false
                    }
                ],
                "instructions":  [
                    "Step 1: Do this..."
                    "Step 2: DO that..."
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
    - Have diversity in recipes in terms of time, cuisine, and diffculty level"""

    return system_prompt

def get_user_data(fridge, pantry, dietary_restrictions, preferences):
    user_prompt = f"""
    FRIDGE INVENTORY: {fridge}
    PANTRY INVENTORY: {pantry}
    DIETARY RESTRICTIONS: {dietary_restrictions}
    USER PREFERENCES: {preferences}
    Generate diverse recipes using this information. Priortize items expiring within 3 days."""

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
if __name__ == "__main__":
    client = LLMClient()
    
    response = client.chat("Recipe for lasagna")
    print(response)