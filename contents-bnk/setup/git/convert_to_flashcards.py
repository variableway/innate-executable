import re
import json
import os

def parse_markdown_to_flashcards(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    flashcards = []
    
    # Split content by Level 2 headers (Categories/Languages)
    # Regex finds: ## Title \n Content
    # We use capturing group for title to keep it.
    categories = re.split(r'(^|\n)##\s+(.+)\n', content)
    
    # re.split returns [preamble, newline_matched, Title, Content, newline_matched, Title, Content...]
    # We iterate starting from index 2 (first title)
    
    # If no ## headers found, treat whole file as one category "Default"
    if len(categories) < 2:
        category_blocks = [("Default", content)]
    else:
        category_blocks = []
        # Skip index 0 (preamble before first header)
        # Loop with step 3 because split gives: [sep, title, content]
        # But wait, split behavior depends on groups.
        # r'(^|\n)##\s+(.+)\n' has 2 groups.
        # Output: [text_before, sep, title, text_after, sep, title, text_after...]
        
        # Let's clean up the list logic
        i = 1
        while i < len(categories):
            # categories[i] is the separator (^ or \n), ignore
            if i + 1 < len(categories) and i + 2 < len(categories):
                title = categories[i+1].strip()
                body = categories[i+2]
                category_blocks.append((title, body))
            i += 3

    for category_name, category_content in category_blocks:
        # Determine language from category name (simple heuristic)
        language = "English" # Default
        if "Chinese" in category_name or "中文" in category_name:
            language = "Chinese"
        elif "English" in category_name:
            language = "English"
        else:
            language = category_name # Use category name as language/tag
            
        # Split by Level 3 headers (Sections)
        sections = re.split(r'(^|\n)###\s+(.+)\n', category_content)
        
        # Similar logic: [preamble, sep, title, content, sep, title, content...]
        j = 1
        while j < len(sections):
            if j + 1 < len(sections) and j + 2 < len(sections):
                section_title = sections[j+1].strip()
                section_body = sections[j+2]
                
                # Analyze section body to decide if it's a "Group of Simple Cards" or "Single Complex Card"
                
                # Check for bullet points with bold text: * **Question**: Answer
                simple_card_matches = re.findall(r'^\s*\*\s+\*\*(.*?)\*\*[:|：]?(.*)', section_body, re.MULTILINE)
                
                if simple_card_matches:
                    # Treat as group of simple cards
                    # We need to extract them carefully to capture multi-line code blocks
                    
                    lines = section_body.split('\n')
                    k = 0
                    while k < len(lines):
                        line = lines[k]
                        bullet_match = re.match(r'^\s*\*\s+\*\*(.*?)\*\*[:|：]?.*', line)
                        
                        if bullet_match:
                            question = bullet_match.group(1).strip()
                            
                            # Capture answer (including subsequent lines until next bullet or end of section)
                            answer_lines = []
                            
                            # If there is text on the same line as bullet, add it
                            # The regex group(0) is the whole line. 
                            # We want the text AFTER the bold part.
                            # But simpler: just look for code blocks or text below.
                            
                            # Let's look for associated code block below
                            m = k + 1
                            found_code = False
                            in_code = False
                            code_lines = []
                            
                            while m < len(lines):
                                next_line = lines[m]
                                # Stop if next bullet
                                if re.match(r'^\s*\*\s+\*\*', next_line):
                                    break
                                # Stop if empty line? No, empty lines are allowed.
                                
                                if '```' in next_line:
                                    in_code = not in_code
                                    if not in_code: # End of block
                                        found_code = True
                                        # break? No, there might be text after? Usually not in this format.
                                        # But let's keep capturing until next bullet.
                                
                                if in_code or found_code: 
                                    # If we found code, we keep adding lines until we hit next bullet
                                    # But wait, the simple parser in previous script only looked for ONE code block.
                                    pass
                                
                                code_lines.append(next_line)
                                m += 1
                            
                            # Clean up answer
                            # If code lines exist, join them.
                            full_answer = '\n'.join([l for l in code_lines if l.strip() != '']).strip()
                            
                            # If the answer is empty, check the same line
                            if not full_answer:
                                # Try to get text from the same line
                                same_line_text = line.split('**')[-1].strip()
                                if same_line_text and same_line_text not in [':', '：']:
                                    full_answer = same_line_text.lstrip(':： ')
                            
                            # Format code blocks correctly if they were captured raw
                            # (The previous loop captures the ``` lines too)
                            
                            flashcards.append({
                                "language": language,
                                "question": question,
                                "answer": full_answer
                            })
                            
                            k = m - 1 # Advance loop
                        k += 1

                else:
                    # Treat as Single Complex Card
                    # Question = Section Title
                    # Answer = Section Body (cleaned)
                    
                    # Heuristic: If body contains numbered list steps, try to format them nicely?
                    # Or just dump the whole body as markdown? 
                    # User asked for "flashcard mode", usually concise.
                    # But for "How to...", the whole body is the answer.
                    
                    # Clean up: remove leading/trailing whitespace
                    clean_answer = section_body.strip()
                    
                    # Remove the "1. " from title if present (optional, but looks cleaner)
                    clean_title = re.sub(r'^\d+\.\s*', '', section_title)
                    
                    flashcards.append({
                        "language": language,
                        "question": clean_title,
                        "answer": clean_answer
                    })
                
            j += 3

    return flashcards

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    md_file = os.path.join(base_dir, "git_and_github_5_minute_guide.md")
    json_file = os.path.join(base_dir, "flashcards.json")
    
    try:
        cards = parse_markdown_to_flashcards(md_file)
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(cards, f, ensure_ascii=False, indent=4)
        print(f"Successfully created {len(cards)} flashcards.")
    except Exception as e:
        print(f"Error: {e}")
