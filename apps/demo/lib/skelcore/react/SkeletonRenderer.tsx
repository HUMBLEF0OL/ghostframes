"use client";

import React from "react";
import type { Blueprint, BlueprintNode, SkeletonConfig } from "../core";

export interface SkeletonRendererProps {
  blueprint: Blueprint;
  config: SkeletonConfig;
  mode?: "flow" | "absolute";
  slots?: Record<string, () => React.ReactNode>;
}

/**
 * Pure React component to render a SkelCore Blueprint.
 * Decoupled from measurement logic; focuses entirely on visual mapping.
 */
export const SkeletonRenderer: React.FC<SkeletonRendererProps> = ({
  blueprint,
  config,
  mode = "absolute",
  slots = {},
}) => {
  const renderNode = (node: BlueprintNode): React.ReactNode => {
    if (node.role === "skip") return null;

    const isContainer = node.role === "container" || node.isTable || node.isTableRow;
    const isText = node.role === "text" && node.text;
    const animationClass = config.animation === "none" ? "" : `skel-${config.animation}`;

    // Common style attributes
    const commonStyles: React.CSSProperties = {
      borderRadius: node.borderRadius,
      backgroundColor: config.baseColor,
      position: mode === "absolute" ? "absolute" : "relative",
    };

    if (mode === "absolute") {
      commonStyles.top = `${node.top}px`;
      commonStyles.left = `${node.left}px`;
      commonStyles.width = `${node.width}px`;
      commonStyles.height = `${node.height}px`;
    }

    // 1. Handle Container / Table Roles
    if (isContainer) {
      let Tag: React.ElementType = "div";
      if (node.isTable) Tag = "table";
      else if (node.isTableRow) Tag = "tr";
      else if (node.role === "table-cell") Tag = "td";

      return (
        <Tag
          key={node.id}
          className={`skel-container ${node.tagName.toLowerCase()}`}
          style={{
            ...commonStyles,
            backgroundColor: "transparent", // Containers are invisible
            ...(node.layout as React.CSSProperties),
          }}
        >
          {node.children.map(renderNode)}
        </Tag>
      );
    }

    // 2. Handle Text Role (Multi-line bars)
    if (isText && node.text) {
      const { lines, lineHeight, lastLineWidthRatio } = node.text;
      return (
        <div
          key={node.id}
          className="skel-text-group"
          style={{ ...commonStyles, backgroundColor: "transparent" }}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <span
              key={`${node.id}-line-${i}`}
              className={`skel-block ${animationClass}`}
              style={{
                display: "block",
                width: i === lines - 1 ? `${lastLineWidthRatio * 100}%` : "100%",
                height: `${config.minTextHeight}px`,
                marginBottom: i < lines - 1 ? `${lineHeight - config.minTextHeight}px` : 0,
                borderRadius: "4px",
                backgroundColor: config.baseColor,
              }}
            />
          ))}
        </div>
      );
    }

    // 3. Handle Custom Slots
    if (node.role === "custom" && node.slotKey && slots[node.slotKey]) {
      return (
        <div key={node.id} style={commonStyles}>
          {slots[node.slotKey]()}
        </div>
      );
    }

    // 4. Default: Render as Atomic Block (Image, Button, Icon, etc.)
    return (
      <div
        key={node.id}
        className={`skel-block ${animationClass} skel-role-${node.role}`}
        style={{
          ...commonStyles,
          aspectRatio: node.aspectRatio,
        }}
      />
    );
  };

  const rootStyle: React.CSSProperties = {
    position: "relative",
    width: blueprint.rootWidth > 0 ? `${blueprint.rootWidth}px` : "100%",
    height: blueprint.rootHeight > 0 ? `${blueprint.rootHeight}px` : "auto",
    overflow: "hidden",
  };

  return (
    <div className="skel-renderer-root" style={rootStyle}>
      {blueprint.nodes.map(renderNode)}
    </div>
  );
};
