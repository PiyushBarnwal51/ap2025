from transformers import pipeline
classifier = pipeline("sentiment-analysis")
result = classifier("I love this hackathon!")
print(result)  # Output: [{'label': 'POSITIVE', 'score': 0.99}]
